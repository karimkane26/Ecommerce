import React from 'react';
import ReactDOM from 'react-dom/client';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles/bootstrap.custom.css';
import './assets/styles/index.css';
import App from './App';
import {createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import {PayPalScriptProvider} from '@paypal/react-paypal-js';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import AdminRoute from './components/AdminRoute';
import PrivateRoute from './components/PrivateRoute';
import OrderListScreen from './screens/admin/OrderListScreen';
// import PlaceOrderScreen from './screens/PlaceOrderScreen';
// import OrderScreen from './screens/OrderScreen';
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
    <Route index={true} path='/' element={<HomeScreen />} />
    <Route path='product/:id' element={<ProductScreen />} />
    <Route path='/register' element={<RegisterScreen />}/>
    <Route path='cart' element={<CartScreen />} />
    <Route  path='/login' element={<LoginScreen />}/>
    
  <Route path='' element={<PrivateRoute />}>
      <Route  path='/shipping' element={<ShippingScreen />}/>
    <Route  path='/payment' element={<PaymentScreen />}/>
    <Route  path='/placeorder' element={<PlaceOrderScreen />}/>
    <Route  path='order/:id' element={ <OrderScreen />}/>
    <Route  path='profile' element={<ProfileScreen />}/>

  </Route>
  
  <Route path='' element={<AdminRoute />}>
    <Route path='/admin/orderlist' element={<OrderListScreen />} />
  </Route>

    </Route>

    
  )
)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <PayPalScriptProvider deferLoading={true} >
    <RouterProvider  router={router}/>
    </PayPalScriptProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
