import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import { useProductContext } from "../Contexts/ProductContext";
const HomeScreen = () => {
  const { products, fetchProducts } = useProductContext();
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  return (
    <>
      <h1>Latest Products</h1>

      <Row>
        {products.map((product) => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default HomeScreen;
