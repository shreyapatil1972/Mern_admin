import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap'; // Added Spinner
import { getAllCategories, createproduct } from '../../API/Api'; // Ensure path is correct

// Import the CSS file for this component
import '../../Css/AddProduct.css'; // You'll create this file next

function AddProduct({ onHide, onProductAdded, ...props }) {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '', // This will hold the category ID
    quantity: '',
    inStock: true,
    image: null,
  });

  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // To show validation/submission errors

  useEffect(() => {
    const fetchData = async () => {
      const catRes = await getAllCategories();
      // Assuming categories are returned in a 'categories' property
      if (catRes.success && Array.isArray(catRes.categories)) {
        setCategories(catRes.categories);
      } else {
        console.error("Failed to fetch categories:", catRes);
        setCategories([]);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setErrorMessage(''); // Clear error message on input change

    if (type === 'checkbox') {
      setProduct((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      setProduct((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setProduct({
      name: '',
      description: '',
      price: '',
      category: '',
      quantity: '',
      inStock: true,
      image: null,
    });
    setErrorMessage('');
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm(); // Reset form when modal closes
    onHide();
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setErrorMessage(''); // Clear previous error messages

    const { name, description, price, category, quantity, image } = product;

    if (!name.trim() || !description.trim() || !price || !category || !quantity || !image) {
      setErrorMessage('Please fill all fields and upload an image.');
      return;
    }
    if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      setErrorMessage('Please enter a valid positive price.');
      return;
    }
    if (isNaN(parseInt(quantity)) || parseInt(quantity) <= 0) {
      setErrorMessage('Please enter a valid positive quantity.');
      return;
    }
    
    // Additional check for category selection
    if (!category) {
      setErrorMessage('Please select a category.');
      return;
    }


    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('description', description.trim());
    formData.append('price', parseFloat(price));
    formData.append('Category_id', category); // Use Category_id as per your API
    formData.append('quantity', parseInt(quantity));
    formData.append('inStock', product.inStock); // Boolean is fine, backend should handle
    formData.append('image', image);

    setIsSubmitting(true);
    try {
      const response = await createproduct(formData);
      if (response.success) {
        alert('Product added successfully!');
        onProductAdded?.(); // Callback to parent to refresh product list
        handleClose(); // Close modal and reset form
      } else {
        setErrorMessage(response.message || 'Failed to add product.');
      }
    } catch (error) {
      console.error('Add product error:', error);
      setErrorMessage('An error occurred while adding the product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={props.show} // Pass show prop
      onHide={handleClose} // Use handleClose to reset form
      className="add-product-modal" // Apply main modal class
    >
      <Modal.Header closeButton className="modal-header-custom">
        <Modal.Title id="contained-modal-title-vcenter" className="modal-title-custom">
          Add New Product
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="modal-body-custom">
        <Form onSubmit={handleSubmit}> {/* Attach onSubmit to Form */}
          <Form.Group className="mb-3">
            <Form.Label className="form-label-custom">Product Name</Form.Label> {/* Added label */}
            <Form.Control
              type="text"
              placeholder="Enter product name"
              name="name"
              value={product.name}
              onChange={handleChange}
              className="form-control-custom"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="form-label-custom">Description</Form.Label> {/* Added label */}
            <Form.Control
              as="textarea"
              rows={3} // More rows for description
              placeholder="Enter description"
              name="description"
              value={product.description}
              onChange={handleChange}
              className="form-control-custom"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="form-label-custom">Price (₹)</Form.Label> {/* Added label */}
            <Form.Control
              type="number"
              step="0.01" // Allow decimal prices
              placeholder="Enter price"
              name="price"
              value={product.price}
              onChange={handleChange}
              className="form-control-custom"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="form-label-custom">Quantity</Form.Label> {/* Added label */}
            <Form.Control
              type="number"
              placeholder="Enter quantity"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
              className="form-control-custom"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="form-label-custom">Category</Form.Label> {/* Added label */}
            <Form.Select
              name="category"
              value={product.category}
              onChange={handleChange}
              className="form-select-custom" // Use custom class for select
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                // Use _id for consistency, or whatever your category object's ID field is
                <option key={cat._id || cat.id} value={cat._id || cat.id}>{cat.name}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox" // Specify type for checkbox
              label="In Stock"
              name="inStock"
              checked={product.inStock}
              onChange={handleChange}
              className="form-check-custom" // Use custom class for checkbox
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="form-label-custom">Product Image</Form.Label> {/* Added label */}
            <Form.Control
              type="file"
              name="image"
              onChange={handleChange}
              className="form-control-custom file-input" // Use custom class for file input
              accept="image/*"
            />
          </Form.Group>

          {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
        </Form>
      </Modal.Body>

      <Modal.Footer className="modal-footer-custom">
        <Button
          type="submit" // Set type to submit for form submission
          className="btn-add-product" // Apply custom class
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />{' '}
              Adding...
            </>
          ) : (
            'Add Product'
          )}
        </Button>

        <Button
          variant="secondary"
          onClick={handleClose} // Use handleClose
          disabled={isSubmitting}
          className="btn-cancel-modal" // Apply custom class
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddProduct;