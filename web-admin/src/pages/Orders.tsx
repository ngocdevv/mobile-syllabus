import { useEffect, useState } from 'react';
import api from '@/services/api';
import type { Order } from '@/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';

export default function Orders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [updating, setUpdating] = useState(false);
    const { toast } = useToast();

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders/admin/all');
            setOrders(response.data);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch orders",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleViewOrder = async (orderId: number) => {
        try {
            const response = await api.get(`/orders/admin/${orderId}`);
            setSelectedOrder(response.data);
            setIsDialogOpen(true);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch order details",
            });
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        try {
            await api.delete(`/orders/admin/${id}`);
            toast({ title: "Success", description: "Order deleted" });
            fetchOrders();
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Delete failed" });
        }
    };

    const handleUpdateStatus = async (status: string) => {
        if (!selectedOrder) return;
        setUpdating(true);
        try {
            await api.put(`/orders/admin/${selectedOrder.id}/status`, { status });
            toast({
                title: "Success",
                description: "Order status updated successfully",
            });
            setSelectedOrder({ ...selectedOrder, status });
            fetchOrders(); // Refresh list
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update order status",
            });
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Orders</h1>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Total Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">Loading...</TableCell>
                            </TableRow>
                        ) : orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>#{order.id}</TableCell>
                                <TableCell>{order.users?.full_name || 'Unknown'}</TableCell>
                                <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                            order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                    'bg-red-100 text-red-800'
                                        }`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </TableCell>
                                <TableCell>{format(new Date(order.created_at), 'MMM dd, yyyy')}</TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button variant="outline" size="sm" onClick={() => handleViewOrder(order.id)}>
                                            View Details
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(order.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Order Details #{selectedOrder?.id}</DialogTitle>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-semibold">Customer Info</h3>
                                    <p>Name: {selectedOrder.users?.full_name}</p>
                                    <p>Email: {selectedOrder.users?.email}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Order Info</h3>
                                    <p>Date: {format(new Date(selectedOrder.created_at), 'PPP')}</p>
                                    <p>Total: ${selectedOrder.total_amount.toFixed(2)}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2">Update Status</h3>
                                <Select
                                    value={selectedOrder.status}
                                    onValueChange={handleUpdateStatus}
                                    disabled={updating}
                                >
                                    <SelectTrigger className="w-[200px]">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="processing">Processing</SelectItem>
                                        <SelectItem value="shipped">Shipped</SelectItem>
                                        <SelectItem value="delivered">Delivered</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2">Items</h3>
                                <div className="border rounded-md overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Product</TableHead>
                                                <TableHead>Quantity</TableHead>
                                                <TableHead>Price</TableHead>
                                                <TableHead>Total</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {selectedOrder.items?.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>{item.product?.name || 'Unknown Product'}</TableCell>
                                                    <TableCell>{item.quantity}</TableCell>
                                                    <TableCell>${item.price.toFixed(2)}</TableCell>
                                                    <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
