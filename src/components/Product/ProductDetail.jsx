import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getproductByID,
  getAllCategories,
} from "../../API/Api"; // Ensure path is correct
import { Button, Card, Row, Col, Spinner } from "react-bootstrap"; // Added Spinner
import { BsArrowLeft } from "react-icons/bs";
import DeleteProduct from "./DeleteProduct"; // Ensure path is correct
import EditProduct from "./EditProduct"; // Ensure path is correct

// Import the CSS file for this component
import '../../Css/ProductDetail.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getproductByID(id);
      if (response.success) {
        setProduct(response.product);
      } else {
        setError("Failed to fetch product details.");
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("An error occurred while loading product details.");
    } finally {
      setLoading(false);
    }
  };

  const handleProductDelete = (success, message) => {
    alert(message);
    if (success) {
      navigate("/product"); // Redirect to product list after successful delete
    }
    setShowDeleteModal(false); // Hide modal after action
  };

  // Callback for when product is successfully updated in EditProduct modal
  const handleProductUpdated = (success, message) => {
    alert(message);
    if (success) {
      fetchProduct(); // Re-fetch product details to show updated info
    }
    setShowEditModal(false); // Hide modal after action
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchProduct();
      const categoryResponse = await getAllCategories();
      if (categoryResponse.success) {
        setCategories(categoryResponse.categories);
      } else {
        console.error("Failed to fetch categories.");
      }
    };
    fetchData();
  }, [id]); // Re-fetch data if product ID changes

  const getCategoryName = (categoryId) => { // Renamed param for clarity
    const category = categories.find((cat) => cat._id === categoryId); // Assuming _id for category
    return category ? category.name : "Unknown Category";
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" className="product-details-spinner" />
        <p className="loading-text mt-3">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return <p className="product-details-error text-center mt-4">{error}</p>;
  }

  if (!product) {
    return <p className="product-details-no-data text-center mt-4">Product not found.</p>;
  }

  return (
    <div className="product-details-page-container mt-4">
      <Button
        className="back-button mb-4" // Added class and margin
        onClick={() => navigate("/product")}
      >
        <BsArrowLeft className="back-button-icon" /> Back to Products
      </Button>

      <Card className="product-details-card"> {/* Added class */}
        <Row className="g-0"> {/* Use g-0 for no gutter between cols directly */}
          <Col md={5} className="product-image-col"> {/* Adjust column size */}
            <Card.Img
              src={product.image}
              alt={product.name}
              className="product-details-img" // Added class
            />
          </Col>
          <Col md={7} className="product-info-col"> {/* Adjust column size */}
            <Card.Body className="product-details-body"> {/* Added class */}
              <h2 className="product-details-title">{product.name}</h2> {/* Added class */}
              <p className="product-details-description">{product.description}</p>
              
              <div className="product-details-specs"> {/* New wrapper for structured info */}
                <p>
                  <strong className="spec-label">Price:</strong>{" "}
                  <span className="spec-value">₹{product.price}</span>
                </p>
                <p>
                  <strong className="spec-label">Quantity:</strong>{" "}
                  <span className="spec-value">{product.quantity}</span>
                </p>
                <p>
                  <strong className="spec-label">In Stock:</strong>{" "}
                  <span className={`spec-value ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                    {product.inStock ? "Yes" : "No"}
                  </span>
                </p>
                <p>
                  <strong className="spec-label">Category:</strong>{" "}
                  <span className="spec-value">{getCategoryName(product.Category_id)}</span>
                </p>
              </div>

              <div className="d-flex gap-3 mt-4"> {/* Adjusted margin-top */}
                <Button className="edit-button" onClick={() => setShowEditModal(true)}>
                  Edit
                </Button>
                <Button className="delete-button" onClick={() => setShowDeleteModal(true)}>
                  Delete
                </Button>
              </div>
            </Card.Body>
          </Col>
        </Row>
      </Card>

      {/* Edit Modal */}
      <EditProduct
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        product={product}
        onProductUpdated={handleProductUpdated} // Use the new handler
        categories={categories} // Pass categories to the edit modal
      />

      {/* Delete Modal */}
      <DeleteProduct
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        productId={id}
        onProductDelete={handleProductDelete}
      />
    </div>
  );
};

export default ProductDetails;