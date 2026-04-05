import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDasboard from './pages/AdminDasboard';
import AddCategory from './pages/AddCategory';
import ManageCategory from './pages/ManageCategory';
import AddFood from './pages/AddFood';
import ManageFood from './pages/ManageFood';
import Search from './pages/Search';
import Register from './pages/Register';
import Login from './pages/Login';
import FoodDetail from './pages/FoodDetail';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import MyOrders from './pages/MyOrders';
import OrderDetails from './pages/OrderDetails';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import OrdersNotConfirmed from './pages/OrdersNotConfirmed';
import FoodPickup from './pages/FoodPickup';
import FoodBeingPrepared from './pages/FoodBeingPrepared';
import FoodDelivered from './pages/FoodDelivered';
import OrderCancelled from './pages/OrderCancelled';
import AllOrders from './pages/AllOrders';
import OrderReport from './pages/OrderReport';
import ViewFoodOrder from './pages/ViewFoodOrder';
import SearchAdmin from './pages/SearchAdmin';
import EditCategory from './pages/EditCategory';
import EditFood from './pages/EditFood';
import ManageUsers from './pages/ManageUsers';
import { CartProvider } from './context/CartContext';
import FoodList from './pages/FoodList';
import { WishlistProvider } from './context/WishlistContext';
import Wishlist from './pages/Wishlist';
import TrackOrder from './pages/TrackOrder';
import ManageReviews from './pages/ManageReviews';
import OrdersConfirmed from './pages/OrdersConfirmed';

function App() {
  return (
    <WishlistProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-dashboard" element={<AdminDasboard />} />
            <Route path="/add-category" element={<AddCategory />} />
            <Route path="/manage-category" element={<ManageCategory />} />
            <Route path="/manage-reviews" element={<ManageReviews />} />
            <Route path="/add-food" element={<AddFood />} />
            <Route path="/manage-food" element={<ManageFood />} />
            <Route
              path="/order-not-confirmed"
              element={<OrdersNotConfirmed />}
            />
            <Route path="/food-pickup" element={<FoodPickup />} />
            <Route
              path="/food-being-prepared"
              element={<FoodBeingPrepared />}
            />
            <Route path="/food-delivered" element={<FoodDelivered />} />
            <Route path="/orders-cancelled" element={<OrderCancelled />} />
            <Route path="/all-orders" element={<AllOrders />} />
            <Route path="/order-report" element={<OrderReport />} />
            <Route path="/order-confirmed" element={<OrdersConfirmed />} />
            <Route path="/manage-users" element={<ManageUsers />} />
            <Route
              path="/admin-view-order-detail/:order_number"
              element={<ViewFoodOrder />}
            />
            <Route path="/search-order" element={<SearchAdmin />} />
            <Route path="/edit_category/:id" element={<EditCategory />} />
            <Route path="/edit_food/:id" element={<EditFood />} />

            <Route path="/search" element={<Search />} />
            <Route path="/menu" element={<FoodList />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/food/:id" element={<FoodDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/track" element={<TrackOrder />} />
            <Route path="/track-order/:order_number" element={<TrackOrder />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route
              path="/order-details/:order_number"
              element={<OrderDetails />}
            />
            <Route path="/profile" element={<Profile />} />
            <Route path="/change-password" element={<ChangePassword />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </WishlistProvider>
  );
}

export default App;
