import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    Tags,
    LogOut,
    Package,
    Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardLayout() {
    const { user, logout, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
    if (!isAuthenticated) return <Navigate to="/login" />;

    const navItems = [
        { href: '/', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/categories', label: 'Categories', icon: Layers },
        { href: '/products', label: 'Products', icon: Package },
        { href: '/orders', label: 'Orders', icon: ShoppingBag },
        { href: '/users', label: 'Users', icon: Users },
        { href: '/brands', label: 'Brands', icon: Tags },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-md flex flex-col">
                <div className="p-6 border-b">
                    <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.href;
                        return (
                            <Link key={item.href} to={item.href}>
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={cn("w-full justify-start", isActive && "bg-gray-100")}
                                >
                                    <Icon className="mr-2 h-4 w-4" />
                                    {item.label}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t">
                    <div className="flex items-center mb-4">
                        <div className="ml-2">
                            <p className="text-sm font-medium">{user?.full_name}</p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full" onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-8">
                <Outlet />
            </div>
        </div>
    );
}
