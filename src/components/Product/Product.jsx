import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getAllproducts } from '../../API/Api'; // Ensure path is correct
import AddProduct from './AddProduct'; // Ensure path is correct

// Import the CSS file for this component
import '../../Css/Product.css'; // You'll create this file next

const Product = () => {
    const [products, setProducts] = useState([]);
    const [addProductModalShow, setAddProductModalShow] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await getAllproducts();
            if (response.success && Array.isArray(response.products)) {
                setProducts(response.products);
            } else {
                setProducts([]);
                setError('Failed to fetch products');
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Calculate product count
    const productCount = products.length;

    return (
        <div className="product-page-container py-4"> {/* Added class */}
            <div className="product-header-controls mb-4"> {/* Added class and adjusted margin */}
                <div>
                    <h3 className="product-list-title">Product List</h3> {/* Added class */}
                    {/* NEW: Display product count here */}
                    {!loading && !error && (
                        <p className="product-count">Total Products: {productCount}</p>
                    )}
                </div>
                <Button
                    className="add-product-btn" // Added class
                    onClick={() => setAddProductModalShow(true)}
                >
                    + Add Product
                </Button>
            </div>
            <hr className="product-divider" /> {/* Added class */}

            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" className="product-spinner" /> {/* Added class */}
                </div>
            ) : error ? (
                <div className="text-danger text-center my-3 product-error-message">{error}</div> // Added class
            ) : products.length === 0 ? (
                <div className="product-no-items text-center">No Products Found</div>
            ) : (
                <Row>
                    {products.map((product) => (
                        <Col md={3} sm={6} xs={12} className="mb-4" key={product._id}>
                            <Card
                                className="product-card" // Added class
                                onClick={() => navigate(`/product/${product._id}`)}
                            >
                                <Card.Img
                                    variant="top"
                                    src={product.image}
                                    alt={product.name}
                                    className="product-card-img" // Added class
                                />
                                <Card.Body className="product-card-body"> {/* Added class */}
                                    <Card.Title className="product-card-title">{product.name}</Card.Title> {/* Added class */}
                                    <Card.Text className="product-card-price">Price: ₹{product.price}</Card.Text> {/* Added class */}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            <AddProduct
                show={addProductModalShow}
                onHide={() => setAddProductModalShow(false)}
                onProductAdded={fetchData} // Pass fetchData to re-fetch products after adding
            />
        </div>
    );
};

export default Product;