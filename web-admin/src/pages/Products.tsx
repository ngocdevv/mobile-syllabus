import { useEffect, useState } from 'react';
import api from '@/services/api';
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
    description: z.string().min(1, "Description is required"),
    price: z.coerce.number().min(0),
    original_price: z.coerce.number().min(0).optional(),
    stock_quantity: z.coerce.number().min(0),
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
            description: '',
            price: 0,
            original_price: 0,
            stock_quantity: 0,
            category_id: 0,
            brand_id: 0,
            image_url: '',
        },
    });

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [productsRes, categoriesRes, brandsRes] = await Promise.all([
                api.get(`/products?page=${page}&limit=10`),
                api.get('/categories'),
                api.get('/brands'),
            ]);
            setProducts(productsRes.data.data);
            setTotalPages(productsRes.data.pagination.total_pages);
            setCategories(categoriesRes.data);
            setBrands(brandsRes.data);
        } catch (error) {
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

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        try {
            const response = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            form.setValue('image_url', response.data.url);
            toast({ title: "Success", description: "Image uploaded" });
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Upload failed" });
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct.id}`, values);
                toast({ title: "Success", description: "Product updated" });
            } else {
                await api.post('/products', values);
                toast({ title: "Success", description: "Product created" });
            }
            setOpen(false);
            setEditingProduct(null);
            form.reset();
            fetchData();
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Operation failed" });
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        try {
            await api.delete(`/products/${id}`);
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
            description: product.description,
            price: product.price,
            original_price: product.original_price,
            stock_quantity: product.stock_quantity,
            category_id: product.category_id,
            brand_id: product.brand_id,
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
                        form.reset({ name: '', description: '', price: 0, stock_quantity: 0, category_id: 0, brand_id: 0, image_url: '' });
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
                                                <FormLabel>Brand</FormLabel>
                                                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select brand" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
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
                                        name="original_price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Original Price</FormLabel>
                                                <FormControl><Input type="number" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="stock_quantity"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Stock</FormLabel>
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
                            <TableHead>Stock</TableHead>
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
                                <TableCell>{product.stock_quantity}</TableCell>
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
