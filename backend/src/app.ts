import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import categoryRoutes from './routes/categoryRoutes';
import productRoutes from './routes/productRoutes';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';
import reviewRoutes from './routes/reviewRoutes';
import addressRoutes from './routes/addressRoutes';
import brandRoutes from './routes/brandRoutes';
import favoriteRoutes from './routes/favoriteRoutes';
import paymentRoutes from './routes/paymentRoutes';
import promocodeRoutes from './routes/promocodeRoutes';
import notificationRoutes from './routes/notificationRoutes';
import userSettingsRoutes from './routes/userSettingsRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/categories', categoryRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/reviews', reviewRoutes);
app.use('/addresses', addressRoutes);
app.use('/brands', brandRoutes);
app.use('/favorites', favoriteRoutes);
app.use('/payments', paymentRoutes);
app.use('/promocodes', promocodeRoutes);
app.use('/notifications', notificationRoutes);
app.use('/settings', userSettingsRoutes);

app.get('/', (req, res) => {
  res.send('Fashion Ecommerce API is running');
});

export default app;
