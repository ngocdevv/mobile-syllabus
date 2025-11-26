import { useEffect, useState } from 'react';
import api from '@/services/api';
import type { User } from '@/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
    email: z.string().email("Invalid email"),
    full_name: z.string().min(1, "Name is required"),
    phone: z.string().optional(),
    role: z.string().min(1, "Role is required"),
    password: z.string().optional(),
});

type UserFormValues = z.infer<typeof formSchema>;

export default function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const form = useForm<UserFormValues>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            email: '',
            full_name: '',
            phone: '',
            role: 'customer',
            password: '',
        },
    });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch users",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const onSubmit = async (values: UserFormValues) => {
        try {
            if (editingUser) {
                await api.put(`/users/${editingUser.id}`, values);
                toast({ title: "Success", description: "User updated" });
            } else {
                if (!values.password) {
                    form.setError('password', { message: 'Password is required for new users' });
                    return;
                }
                await api.post('/users', values);
                toast({ title: "Success", description: "User created" });
            }
            setOpen(false);
            setEditingUser(null);
            form.reset();
            fetchUsers();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.error || "Operation failed"
            });
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        try {
            await api.delete(`/users/${id}`);
            toast({ title: "Success", description: "User deleted" });
            fetchUsers();
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Delete failed" });
        }
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        form.reset({
            email: user.email,
            full_name: user.full_name,
            phone: user.phone || '',
            role: user.role,
            password: '',
        });
        setOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Users</h1>
                <Dialog open={open} onOpenChange={(val) => {
                    setOpen(val);
                    if (!val) {
                        setEditingUser(null);
                        form.reset({ email: '', full_name: '', phone: '', role: 'customer', password: '' });
                    }
                }}>
                    <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" /> Add User</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingUser ? 'Edit User' : 'Add User'}</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="full_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl><Input type="email" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Role</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select role" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="customer">Customer</SelectItem>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password {editingUser && '(Leave blank to keep current)'}</FormLabel>
                                            <FormControl><Input type="password" {...field} /></FormControl>
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
                            <TableHead>Email</TableHead>
                            <TableHead>Full Name</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">Loading...</TableCell>
                            </TableRow>
                        ) : users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.full_name}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {user.role}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(user.id)}>
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
