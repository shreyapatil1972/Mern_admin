import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Image } from "react-bootstrap";
import { updateproduct, getAllCategories } from "../../API/Api"; // Ensure path is correct

// Import the CSS file for this component
import '../../Css/EditProduct.css'; // You'll create this file next

function EditProduct({ show, onHide, product, onProductUpdated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  // Assuming Category_id is stored as _id in the product object and category object
  const [categoryId, setCategoryId] = useState(""); 
  const [inStock, setInStock] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setQuantity(product.quantity);
      setCategoryId(product.Category_id || ""); // Ensure default if null/undefined
      setInStock(product.inStock);
      setPreviewImage(product.image);
      setImageFile(null); // Clear file input on product change
    }
  }, [product]);

  useEffect(() => {
    const fetchData = async () => {
      const categoriesRes = await getAllCategories();
      // Assuming categories are returned in a 'categories' property, like in ProductDetails
      if (categoriesRes.success && Array.isArray(categoriesRes.categories)) {
        setCategories(categoriesRes.categories);
      } else {
        console.error("Failed to fetch categories:", categoriesRes);
        setCategories([]); // Ensure categories is always an array
      }
    };
    fetchData();
  }, []); // Run once on mount to fetch categories

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setPreviewImage(product ? product.image : null); // Revert to current product image
    }
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    formData.append("price", price);
    formData.append("Quantity", quantity);
    formData.append("Category_id", categoryId); // Ensure this matches backend expected key
    formData.append("inStock", inStock);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await updateproduct(product._id, formData);
    if (response.success) {
      onProductUpdated(true, "Product updated successfully!");
      onHide(); // Close modal on success
    } else {
      onProductUpdated(false, response.message || "Failed to update product.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered className="edit-product-modal">
      <Modal.Header closeButton className="modal-header-custom">
        <Modal.Title className="modal-title-custom">Edit Product</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body-custom">
        <Form>
          <Form.Group className="mb-3"> {/* Use mb-3 for Bootstrap spacing */}
            <Form.Label className="form-label-custom">Product Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
              className="form-control-custom"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="form-label-custom">Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}  
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              className="form-control-custom"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="form-label-custom">Price (₹)</Form.Label>
            <Form.Control
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
              className="form-control-custom"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="form-label-custom">Quantity</Form.Label>
            <Form.Control
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              className="form-control-custom"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="form-label-custom">Category</Form.Label>
            <Form.Select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="form-select-custom"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                // Assuming category objects have _id and name properties
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="In Stock"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="form-check-custom"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="form-label-custom">Change Image (optional)</Form.Label>
            <Form.Control type="file" onChange={handleImageChange} accept="image/*" className="form-control-custom file-input" />
          </Form.Group>

          {previewImage && (
            <div className="image-preview-container text-center mb-3">
              <p className="image-preview-text">Image Preview:</p>
              <Image src={previewImage} alt="Preview" thumbnail className="image-preview-thumbnail" />
            </div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer className="modal-footer-custom">
        <Button onClick={handleUpdate} className="btn-update">
          Update Product
        </Button>
        <Button variant="secondary" onClick={onHide} className="btn-cancel">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditProduct;