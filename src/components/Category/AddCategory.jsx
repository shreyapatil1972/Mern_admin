import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form"; // Import Form for Form.Group, Form.Control, Form.Label
import Spinner from "react-bootstrap/Spinner"; // Import Spinner
import { createCategory } from "../../API/Api";

// Import the CSS file for this component
import '../../Css/AddCategory.css'; // <--- NEW: Import the dedicated CSS file

function AddCategory({ onHide, onCategoryAdded, ...props }) {
  const [CategoryName, setCategoryName] = useState("");
  const [CategoryImage, setCategoryImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // For validation/submission errors

  const handleNewCategory = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setErrorMessage(""); // Clear any previous error messages

    if (!CategoryName.trim() || !CategoryImage) {
      setErrorMessage("Please provide both Category name and image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", CategoryName.trim());
    formData.append("image", CategoryImage);

    setIsSubmitting(true);

    try {
      const response = await createCategory(formData);

      if (response?.success) {
        alert("Category created successfully!");
        onCategoryAdded?.(); // Trigger parent update
        onHide?.(); // Close modal
        setCategoryName("");
        setCategoryImage(null);
      } else {
        setErrorMessage(response?.message || "Failed to add category");
      }
    } catch (error) {
      console.error("Add Category Error:", error);
      setErrorMessage(
        error?.response?.data?.message ||
          "An error occurred while adding the category."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset form state when modal closes
    setCategoryName("");
    setCategoryImage(null);
    setErrorMessage("");
    setIsSubmitting(false);
    onHide(); // Call the prop to actually hide the modal
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={props.show} // Ensure modal visibility is controlled by props.show
      onHide={handleClose} // Use the custom handleClose to reset state
      // Apply the main modal class
      className="add-category-modal"
    >
      <Modal.Header
        closeButton
        // Apply header custom class
        className="modal-header-custom"
      >
        <Modal.Title
          id="contained-modal-title-vcenter"
          // Apply title custom class
          className="modal-title-custom"
        >
          Add New Category
        </Modal.Title>
      </Modal.Header>

      <Modal.Body
        // Apply body custom class
        className="modal-body-custom"
      >
        <Form onSubmit={handleNewCategory}> {/* Wrap content in Form and attach onSubmit */}
          <Form.Group className="mb-3">
            <Form.Label className="form-label-custom">Category Name</Form.Label>
            <Form.Control
              type="text"
              className="form-control-custom" // Apply input custom class
              placeholder="Enter category name"
              value={CategoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="form-label-custom">Category Image</Form.Label>
            <Form.Control
              type="file"
              className="form-control-custom file-input" // Apply file input custom class
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setCategoryImage(e.target.files[0])}
            />
          </Form.Group>

          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </Form>
      </Modal.Body>

      <Modal.Footer
        // Apply footer custom class
        className="modal-footer-custom"
      >
        <Button
          type="submit" // Set type to submit so pressing Enter works
          className="btn-create-category" // Apply custom button class
          onClick={handleNewCategory}
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
              />{" "}
              Creating...
            </>
          ) : (
            "Create"
          )}
        </Button>

        <Button
          variant="secondary"
          className="btn-close-modal" // Apply custom button class
          onClick={handleClose} // Use handleClose
          disabled={isSubmitting}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddCategory;