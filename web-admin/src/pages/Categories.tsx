import { useEffect, useState } from 'react';
import api from '@/services/api';
import type { Category } from '@/types';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Plus, Trash2, Edit } from 'lucide-react';
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
    image_url: z.string().url("Invalid URL").optional().or(z.literal('')),
});

export default function Categories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            image_url: '',
        },
    });

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch categories",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (editingCategory) {
                await api.put(`/categories/${editingCategory.id}`, values);
                toast({ title: "Success", description: "Category updated" });
            } else {
                await api.post('/categories', values);
                toast({ title: "Success", description: "Category created" });
            }
            setOpen(false);
            setEditingCategory(null);
            form.reset();
            fetchCategories();
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
            await api.delete(`/categories/${id}`);
            toast({ title: "Success", description: "Category deleted" });
            fetchCategories();
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Delete failed",
            });
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        form.reset({
            name: category.name,
            image_url: category.image_url,
        });
        setOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Categories</h1>
                <Dialog open={open} onOpenChange={(val) => {
                    setOpen(val);
                    if (!val) {
                        setEditingCategory(null);
                        form.reset({ name: '', image_url: '' });
                    }
                }}>
                    <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" /> Add Category</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
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
                                    name="image_url"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Image URL</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
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
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">Loading...</TableCell>
                            </TableRow>
                        ) : categories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell>{category.id}</TableCell>
                                <TableCell>
                                    {category.image_url && (
                                        <img src={category.image_url} alt={category.name} className="h-10 w-10 object-cover rounded" />
                                    )}
                                </TableCell>
                                <TableCell>{category.name}</TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(category)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(category.id)}>
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
