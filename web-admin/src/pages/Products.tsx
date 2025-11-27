import { useEffect, useState } from 'react';
import { supabase } from '@/services/supabase';
import type { Product, Category, Brand } from '@/types';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Plus, Trash2, Edit, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    sku: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    price: z.coerce.number().min(0),
    compare_price: z.coerce.number().min(0).optional(),
    category_id: z.coerce.number().min(1, "Category is required"),
    brand_id: z.coerce.number().optional(),
    image_url: z.string().url("Image is required"),
});

type ProductFormValues = z.infer<typeof formSchema>;

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [uploading, setUploading] = useState(false);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            name: '',
            sku: '',
            description: '',
            price: 0,
            compare_price: 0,
            category_id: 0,
            brand_id: undefined,
            image_url: '',
        },
    });

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch categories and brands
            const { data: categoriesData } = await supabase.from('categories').select('*');
            const { data: brandsData } = await supabase.from('brands').select('*');

            setCategories(categoriesData || []);
            setBrands(brandsData || []);

            // Fetch products with pagination and join with product_images
            const from = (page - 1) * ITEMS_PER_PAGE;
            const to = from + ITEMS_PER_PAGE - 1;

            const { data: productsData, count } = await supabase
                .from('products')
                .select('*, product_images(image_url)', { count: 'exact' })
                .range(from, to)
                .order('created_at', { ascending: false });

            // Map image_url from product_images to product object
            const mappedProducts = productsData?.map((p: any) => ({
                ...p,
                image_url: p.product_images?.[0]?.image_url || ''
            })) || [];

            setProducts(mappedProducts);
            if (count) {
                setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));
            }
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Error", description: "Failed to fetch data" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(filePath);

            form.setValue('image_url', publicUrl);
            toast({ title: "Success", description: "Image uploaded" });
        } catch (error: any) {
            console.error(error);
            toast({ variant: "destructive", title: "Error", description: error.message || "Upload failed" });
        } finally {
            setUploading(false);
        }
    };

    const createSlug = (name: string) => {
        return name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-") + "-" + Date.now();
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const productSku = values.sku || `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

            // Prepare product data (excluding image_url)
            const productData = {
                name: values.name,
                sku: productSku,
                slug: createSlug(values.name), // Generate slug
                description: values.description,
                price: values.price,
                compare_price: values.compare_price,
                category_id: values.category_id,
                brand_id: values.brand_id && values.brand_id !== 0 ? values.brand_id : null
            };

            let productId;

            if (editingProduct) {
                productId = editingProduct.id;
                // Update product (exclude slug update if not needed, but keeping it simple)
                const { error: productError } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', productId);

                if (productError) throw productError;

                // Update image
                const { data: existingImage } = await supabase
                    .from('product_images')
                    .select('id')
                    .eq('product_id', productId)
                    .eq('is_primary', true)
                    .single();

                if (existingImage) {
                    await supabase
                        .from('product_images')
                        .update({ image_url: values.image_url })
                        .eq('id', existingImage.id);
                } else {
                    await supabase
                        .from('product_images')
                        .insert([{ product_id: productId, image_url: values.image_url, is_primary: true }]);
                }

                toast({ title: "Success", description: "Product updated" });
            } else {
                // Create product
                const { data: newProduct, error: productError } = await supabase
                    .from('products')
                    .insert([productData])
                    .select()
                    .single();

                if (productError) throw productError;
                productId = newProduct.id;

                // Create image
                const { error: imageError } = await supabase
                    .from('product_images')
                    .insert([{ product_id: productId, image_url: values.image_url, is_primary: true }]);

                if (imageError) throw imageError;

                toast({ title: "Success", description: "Product created" });
            }
            setOpen(false);
            setEditingProduct(null);
            form.reset();
            fetchData();
        } catch (error: any) {
            console.error(error);
            toast({ variant: "destructive", title: "Error", description: error.message || "Operation failed" });
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        try {
            // Delete images first
            await supabase.from('product_images').delete().eq('product_id', id);

            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;
            toast({ title: "Success", description: "Product deleted" });
            fetchData();
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Delete failed" });
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        form.reset({
            name: product.name,
            sku: product.sku,
            description: product.description,
            price: product.price,
            compare_price: product.compare_price,
            category_id: product.category_id,
            brand_id: product.brand_id || undefined,
            image_url: product.image_url,
        });
        setOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Products</h1>
                <Dialog open={open} onOpenChange={(val) => {
                    setOpen(val);
                    if (!val) {
                        setEditingProduct(null);
                        form.reset({ name: '', sku: '', description: '', price: 0, category_id: 0, brand_id: undefined, image_url: '' });
                    }
                }}>
                    <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" /> Add Product</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="sku"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>SKU (Auto-generated if empty)</FormLabel>
                                                <FormControl><Input {...field} placeholder="Optional" /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="category_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Category</FormLabel>
                                                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select category" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {categories.map((c) => (
                                                            <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="brand_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Brand (Optional)</FormLabel>
                                                <Select
                                                    onValueChange={(val) => field.onChange(val === "0" ? undefined : Number(val))}
                                                    value={field.value ? field.value.toString() : "0"}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select brand" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="0">None</SelectItem>
                                                        {brands.map((b) => (
                                                            <SelectItem key={b.id} value={b.id.toString()}>{b.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl><Textarea {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Price</FormLabel>
                                                <FormControl><Input type="number" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="compare_price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Original Price</FormLabel>
                                                <FormControl><Input type="number" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="image_url"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Image</FormLabel>
                                            <div className="flex gap-4 items-center">
                                                <Input {...field} placeholder="Image URL" />
                                                <div className="relative">
                                                    <Input
                                                        type="file"
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                        onChange={handleUpload}
                                                        accept="image/*"
                                                        disabled={uploading}
                                                    />
                                                    <Button type="button" variant="outline" disabled={uploading}>
                                                        {uploading ? "Uploading..." : <Upload className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                            </div>
                                            {field.value && <img src={field.value} alt="Preview" className="h-20 w-20 object-cover mt-2 rounded" />}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="w-full">Save</Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Brand</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center">Loading...</TableCell>
                            </TableRow>
                        ) : products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.id}</TableCell>
                                <TableCell>
                                    <img src={product.image_url} alt={product.name} className="h-10 w-10 object-cover rounded" />
                                </TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{categories.find(c => c.id === product.category_id)?.name}</TableCell>
                                <TableCell>{brands.find(b => b.id === product.brand_id)?.name}</TableCell>
                                <TableCell>${product.price}</TableCell>
                                <TableCell>{product.sku}</TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(product.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex justify-center space-x-2">
                <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                >
                    Previous
                </Button>
                <span className="py-2">Page {page} of {totalPages}</span>
                <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
