import { useEffect, useState } from 'react';
import api from '@/services/api';
import type { Brand } from '@/types';
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

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    logo_url: z.string().url("Invalid URL").optional().or(z.literal('')),
});

type BrandFormValues = z.infer<typeof formSchema>;

export default function Brands() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
    const [uploading, setUploading] = useState(false);

    const form = useForm<BrandFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            logo_url: '',
        },
    });

    const fetchBrands = async () => {
        try {
            const response = await api.get('/brands');
            setBrands(response.data);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch brands",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

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
            form.setValue('logo_url', response.data.url);
            toast({ title: "Success", description: "Logo uploaded" });
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Upload failed" });
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (values: BrandFormValues) => {
        try {
            if (editingBrand) {
                await api.put(`/brands/${editingBrand.id}`, values);
                toast({ title: "Success", description: "Brand updated" });
            } else {
                await api.post('/brands', values);
                toast({ title: "Success", description: "Brand created" });
            }
            setOpen(false);
            setEditingBrand(null);
            form.reset();
            fetchBrands();
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Operation failed",
            });
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        try {
            await api.delete(`/brands/${id}`);
            toast({ title: "Success", description: "Brand deleted" });
            fetchBrands();
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Delete failed",
            });
        }
    };

    const handleEdit = (brand: Brand) => {
        setEditingBrand(brand);
        form.reset({
            name: brand.name,
            logo_url: brand.logo_url,
        });
        setOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Brands</h1>
                <Dialog open={open} onOpenChange={(val) => {
                    setOpen(val);
                    if (!val) {
                        setEditingBrand(null);
                        form.reset({ name: '', logo_url: '' });
                    }
                }}>
                    <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" /> Add Brand</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingBrand ? 'Edit Brand' : 'Add Brand'}</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="logo_url"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Logo URL</FormLabel>
                                            <div className="flex gap-4 items-center">
                                                <Input {...field} placeholder="Logo URL" />
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
                            <TableHead>Logo</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">Loading...</TableCell>
                            </TableRow>
                        ) : brands.map((brand) => (
                            <TableRow key={brand.id}>
                                <TableCell>{brand.id}</TableCell>
                                <TableCell>
                                    {brand.logo_url && (
                                        <img src={brand.logo_url} alt={brand.name} className="h-10 w-10 object-cover rounded" />
                                    )}
                                </TableCell>
                                <TableCell>{brand.name}</TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(brand)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(brand.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
