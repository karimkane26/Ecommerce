import { Container } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import { ProductProvider } from "./Contexts/ProductContext";
import { CartProvider } from "./Contexts/CartContext"; // Importation du CartProvider
import { AuthProvider } from "./Contexts/AuthContext";
import { ShippingProvider } from "./Contexts/ShippingContext";
import { PaymentProvider } from "./Contexts/PaymentContext";
import { OrdersProvider } from "./Contexts/OrdersContext";
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
   <AuthProvider>
    <ProductProvider>
      <CartProvider> {/* Ajout du CartProvider */}
        <ShippingProvider>
          <PaymentProvider>
            <OrdersProvider>
                  <Header />
        <main className="py-3">
          <Container>
            <Outlet />
          </Container>
        </main>
        <Footer />
            </OrdersProvider>
          </PaymentProvider>
       
        </ShippingProvider>
      </CartProvider>
    </ProductProvider>
   </AuthProvider> 
    
  );
}

export default App;
