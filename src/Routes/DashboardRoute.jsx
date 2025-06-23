// src/routes/dashboardRoutes.js
import { Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
 
import Category from '../components/Category/Category';
import Product from '../components/Product/Product';
import ProductDetails from '../components/Product/ProductDetail';

const DashboardRoutes = [
  <Route index element={<Dashboard />} key="dashboard" />,
  <Route path="profile" element={<Profile />} key="profile" />,
 
  <Route path="category" element={<Category />} key="category" />,
  <Route path='/product' element={<Product/>} key="product"/>,
  <Route path="/product/:id" element={<ProductDetails />} />

];

export default DashboardRoutes;
