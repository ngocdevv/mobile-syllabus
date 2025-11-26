import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import Login from '@/pages/Login';
import DashboardLayout from '@/layouts/DashboardLayout';
import Dashboard from '@/pages/Dashboard';
import Categories from '@/pages/Categories';
import Products from '@/pages/Products';
import Orders from '@/pages/Orders';
import Users from '@/pages/Users';
import Brands from '@/pages/Brands';

// Placeholder components for now
// Placeholder components for now
// const CategoriesPlaceholder = () => <div>Categories Page (Coming Soon)</div>;
// const ProductsPlaceholder = () => <div>Products Page (Coming Soon)</div>;
// const OrdersPlaceholder = () => <div>Orders Page (Coming Soon)</div>;
// const UsersPlaceholder = () => <div>Users Page (Coming Soon)</div>;
// const BrandsPlaceholder = () => <div>Brands Page (Coming Soon)</div>;

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="categories" element={<Categories />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="users" element={<Users />} />
            <Route path="brands" element={<Brands />} />
          </Route>
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
