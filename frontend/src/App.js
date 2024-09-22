import { Container } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import { ProductProvider } from "./Contexts/ProductContext";
import { CartProvider } from "./Contexts/CartContext"; // Importation du CartProvider

const App = () => {
  return (
    <ProductProvider>
      <CartProvider> {/* Ajout du CartProvider */}
        <Header />
        <main className="py-3">
          <Container>
            <Outlet />
          </Container>
        </main>
        <Footer />
      </CartProvider>
    </ProductProvider>
  );
}

export default App;
