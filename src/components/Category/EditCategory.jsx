import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Image, Spinner } from "react-bootstrap"; // Added Spinner
import { updateCategory } from "../../API/Api";

function EditCategory({ show, onHide, category, onCategoryUpdated }) {
  const [categoryName, setCategoryName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // For validation/submission errors

  useEffect(() => {
    if (category) {
      setCategoryName(category.name);
      setImageFile(null); // Clear file input when new category is selected
      setPreviewImage(category.image ? `/uploads/${category.image}` : null); // Assuming backend stores image path
      setErrorMessage(""); // Clear errors on category change
    }
  }, [category]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setErrorMessage(""); // Clear error on image change
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setErrorMessage(""); // Clear previous errors

    if (!categoryName.trim()) {
      setErrorMessage("Category name is required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", categoryName.trim());

    if (imageFile) {
      formData.append("categoryimage", imageFile); // Must match multer field name in backend
    }

    setIsSubmitting(true);
    try {
      const response = await updateCategory(category._id, formData);

      if (response?.success) {
        onCategoryUpdated(true, "Category updated successfully!");
        onHide();
      } else {
        setErrorMessage(response.message || "Failed to update category.");
        onCategoryUpdated(false, response.message || "Failed to update category.");
      }
    } catch (error) {
      console.error("Update Error:", error);
      setErrorMessage("An error occurred while updating the category.");
      onCategoryUpdated(false, "An error occurred while updating the category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        centered
        className="edit-category-modal" // Apply main modal class
      >
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title className="modal-title-custom">Edit Category</Modal.Title>
        </Modal.Header>

        <Modal.Body className="modal-body-custom">
          <Form onSubmit={handleUpdate}> {/* Wrap content in Form and attach onSubmit */}
            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">Category Name</Form.Label>
              <Form.Control
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter category name"
                className="form-control-custom" // Apply input custom class
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">Change Image (optional)</Form.Label>
              <Form.Control
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="form-control-custom file-input" // Apply file input custom class
              />
            </Form.Group>

            {previewImage && (
              <div className="mt-4 text-center image-preview-container">
                <p className="preview-label">Current Image Preview:</p>
                <Image
                  src={previewImage}
                  alt="Category Preview"
                  thumbnail
                  className="preview-image" // Apply image custom class
                />
              </div>
            )}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </Form>
        </Modal.Body>

        <Modal.Footer className="modal-footer-custom">
          <Button
            type="submit" // Set type to submit for form submission
            className="btn-update-category" // Apply custom button class
            onClick={handleUpdate}
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
                Updating...
              </>
            ) : (
              "Update"
            )}
          </Button>
          <Button
            variant="secondary"
            className="btn-cancel-modal" // Apply custom button class
            onClick={onHide}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* --- CSS Styles for EditCategory Modal --- */}
      <style>{`
        /* Root variables (ensure these are globally defined, e.g., in src/index.css or App.css) */
        :root {
            --color-lightest: #FFF2F2;    /* Pale Pink/Off-White */
            --color-light: #A9B5DF;     /* Light Periwinkle/Dusty Blue */
            --color-medium: #7886C7;    /* Medium Periwinkle/Lavender Blue */
            --color-dark: #2D336B;      /* Deep Navy/Indigo */
            --color-text-dark: #2D336B; /* Generally for main text */
            --color-text-light: #FFF2F2; /* For text on dark backgrounds */
            --color-danger: #dc3545; /* Standard red for errors */
        }

        /* --- EditCategory Modal Specific Styles --- */

        .edit-category-modal .modal-content {
            border-radius: 1rem; /* Consistent rounded corners */
            overflow: hidden;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3); /* Deeper shadow for prominence */
        }

        /* --- Modal Header --- */
        .edit-category-modal .modal-header-custom {
            background-color: var(--color-dark); /* Deep Navy */
            color: var(--color-lightest); /* Pale Pink/Off-White text */
            border-bottom: 1px solid var(--color-medium); /* Accent border */
            padding: 1.5rem 2rem;
        }

        .edit-category-modal .modal-title-custom {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--color-light); /* Light Periwinkle for title */
            letter-spacing: 0.5px;
        }

        /* Styling the close button icon for dark background */
        .edit-category-modal .btn-close {
            filter: invert(1) grayscale(1) brightness(2); /* Makes it white/light */
            opacity: 0.8;
            transition: opacity 0.3s ease;
        }

        .edit-category-modal .btn-close:hover {
            opacity: 1;
        }

        /* --- Modal Body --- */
        .edit-category-modal .modal-body-custom {
            background-color: var(--color-lightest); /* Pale Pink/Off-White for body */
            color: var(--color-text-dark); /* Deep Navy text */
            padding: 2rem 2.5rem;
        }

        /* --- Form Elements --- */
        .edit-category-modal .form-label-custom {
            color: var(--color-dark); /* Deep Navy for labels */
            font-weight: 600;
            margin-bottom: 0.5rem;
            display: block; /* Ensures label takes full width */
            font-size: 0.95rem;
        }

        .edit-category-modal .form-control-custom {
            background-color: #ffffff; /* Pure white input background */
            border: 1px solid var(--color-light); /* Light Periwinkle border */
            color: var(--color-text-dark); /* Deep Navy text */
            border-radius: 0.5rem; /* Slightly rounded inputs */
            padding: 0.75rem 1rem; /* Comfortable padding */
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .edit-category-modal .form-control-custom:focus {
            border-color: var(--color-medium); /* Medium Periwinkle on focus */
            box-shadow: 0 0 0 0.25rem rgba(120, 134, 199, 0.25); /* Elegant focus ring */
            background-color: #ffffff; /* Keep background white on focus */
        }

        /* Styling for placeholder text */
        .edit-category-modal .form-control-custom::placeholder {
            color: rgba(45, 51, 107, 0.6); /* Slightly transparent dark navy */
        }

        /* Specific for file input to look consistent */
        .edit-category-modal .form-control-custom.file-input {
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
        }

        /* Image Preview Styles */
        .edit-category-modal .image-preview-container {
            margin-top: 2rem; /* More space above preview */
            padding-top: 1.5rem;
            border-top: 1px dashed var(--color-light); /* Dashed line for subtle separation */
        }

        .edit-category-modal .preview-label {
            font-weight: 600;
            color: var(--color-dark);
            margin-bottom: 1rem;
            font-size: 1.1rem;
        }

        .edit-category-modal .preview-image {
            max-height: 180px; /* Slightly larger preview */
            width: auto;
            border-radius: 0.75rem; /* Match input border radius */
            border: 2px solid var(--color-light); /* Light border around image */
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            object-fit: contain; /* Ensure image fits well */
        }

        /* Error Message */
        .edit-category-modal .error-message {
            color: var(--color-danger); /* Red for error messages */
            font-size: 0.9rem;
            margin-top: 1rem;
            text-align: center;
            font-weight: 500;
        }

        /* --- Modal Footer --- */
        .edit-category-modal .modal-footer-custom {
            background-color: var(--color-dark); /* Deep Navy */
            border-top: 1px solid var(--color-medium); /* Accent border */
            padding: 1.5rem 2rem;
            justify-content: flex-end; /* Push buttons to the right */
            gap: 1rem; /* Space between buttons */
        }

        /* Custom Button Styles */
        .edit-category-modal .btn-update-category,
        .edit-category-modal .btn-cancel-modal {
            font-weight: 600;
            border-radius: 2rem !important; /* Rounded pill shape */
            padding: 0.6rem 1.8rem !important; /* Ample padding */
            font-size: 1rem;
            transition: all 0.3s ease;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
            border: none !important; /* Remove default borders */
        }

        .edit-category-modal .btn-update-category {
            background-color: var(--color-medium) !important; /* Medium Periwinkle */
            color: var(--color-lightest) !important; /* Lightest text */
        }

        .edit-category-modal .btn-update-category:hover:not(:disabled) {
            background-color: var(--color-light) !important; /* Lighter Periwinkle on hover */
            transform: translateY(-2px); /* Slight lift */
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
        }

        .edit-category-modal .btn-update-category:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            background-color: var(--color-medium) !important; /* Keep primary color but dimmed */
            box-shadow: none !important;
            transform: none !important;
        }

        .edit-category-modal .btn-cancel-modal {
            background-color: transparent !important;
            border: 1px solid var(--color-light) !important; /* Light Periwinkle border */
            color: var(--color-light) !important; /* Light Periwinkle text */
        }

        .edit-category-modal .btn-cancel-modal:hover:not(:disabled) {
            background-color: rgba(255, 255, 255, 0.08) !important; /* Subtle light hover on transparent */
            color: var(--color-lightest) !important; /* Lighter text on hover */
            transform: translateY(-2px); /* Slight lift */
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
        }

        .edit-category-modal .btn-cancel-modal:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            background-color: transparent !important;
            box-shadow: none !important;
            transform: none !important;
        }

        /* Spinner color for consistency */
        .edit-category-modal .spinner-border {
            color: var(--color-lightest) !important; /* Spinner matches text color */
        }
      `}</style>
    </>
  );
}

export default EditCategory;