import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner'; // Added Spinner
import { deleteCategory } from '../../API/Api';

function DeleteCategory({ show, onHide, CategoryId, onCategoryDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteCategory = async () => {
    if (!CategoryId) return;

    setIsDeleting(true);
    try {
      const response = await deleteCategory(CategoryId);

      if (response?.success) {
        onCategoryDelete(true, response.message || 'Category deleted successfully!');
      } else {
        onCategoryDelete(false, response.message || 'Failed to delete category.');
      }
    } catch (error) {
      console.error("Delete Error:", error);
      onCategoryDelete(false, 'Something went wrong while deleting the category.');
    } finally {
      setIsDeleting(false);
      onHide(); // Always close modal
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        centered
        className="delete-category-modal" // Apply main modal class
      >
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title className="modal-title-custom">Delete Category</Modal.Title>
        </Modal.Header>

        <Modal.Body className="modal-body-custom">
          <p className="confirmation-text">
            Are you sure you want to delete this category?
          </p>
          <strong className="warning-text">This action cannot be undone.</strong>
        </Modal.Body>

        <Modal.Footer className="modal-footer-custom">
          <Button
            className="btn-delete-confirm" // Apply custom delete button class
            onClick={handleDeleteCategory}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{' '}
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
          <Button
            className="btn-cancel-modal" // Re-use cancel button style
            onClick={onHide}
            disabled={isDeleting}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* --- CSS Styles for DeleteCategory Modal --- */}
      <style>{`
        /* Root variables (ensure these are globally defined, e.g., in src/index.css or App.css) */
        :root {
            --color-lightest: #FFF2F2;    /* Pale Pink/Off-White */
            --color-light: #A9B5DF;     /* Light Periwinkle/Dusty Blue */
            --color-medium: #7886C7;    /* Medium Periwinkle/Lavender Blue */
            --color-dark: #2D336B;      /* Deep Navy/Indigo */
            --color-text-dark: #2D336B; /* Generally for main text */
            --color-text-light: #FFF2F2; /* For text on dark backgrounds */
            --color-danger: #dc3545; /* Standard red for delete/error */
        }

        /* --- DeleteCategory Modal Specific Styles --- */

        .delete-category-modal .modal-content {
            border-radius: 1rem; /* Consistent rounded corners */
            overflow: hidden;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3); /* Soft, deep shadow */
        }

        /* --- Modal Header --- */
        .delete-category-modal .modal-header-custom {
            background-color: var(--color-dark); /* Deep Navy */
            color: var(--color-lightest); /* Pale Pink/Off-White text */
            border-bottom: 1px solid var(--color-medium); /* Accent border */
            padding: 1.5rem 2rem;
        }

        .delete-category-modal .modal-title-custom {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--color-light); /* Light Periwinkle for title */
            letter-spacing: 0.5px;
        }

        /* Styling the close button icon for dark background */
        .delete-category-modal .btn-close {
            filter: invert(1) grayscale(1) brightness(2); /* Makes it white/light */
            opacity: 0.8;
            transition: opacity 0.3s ease;
        }

        .delete-category-modal .btn-close:hover {
            opacity: 1;
        }

        /* --- Modal Body --- */
        .delete-category-modal .modal-body-custom {
            background-color: var(--color-lightest); /* Pale Pink/Off-White for body */
            color: var(--color-text-dark); /* Deep Navy text */
            padding: 2rem 2.5rem;
            text-align: center; /* Center the text for a clear message */
            font-size: 1.1rem;
            line-height: 1.6;
        }

        .delete-category-modal .confirmation-text {
            margin-bottom: 0.5rem;
            font-weight: 500;
        }

        .delete-category-modal .warning-text {
            color: var(--color-danger); /* Use danger color for strong warning */
            font-size: 1.2rem;
            font-weight: 700;
            display: block; /* Ensure it takes its own line */
            margin-top: 0.5rem;
        }

        /* --- Modal Footer --- */
        .delete-category-modal .modal-footer-custom {
            background-color: var(--color-dark); /* Deep Navy */
            border-top: 1px solid var(--color-medium); /* Accent border */
            padding: 1.5rem 2rem;
            justify-content: flex-end; /* Push buttons to the right */
            gap: 1rem; /* Space between buttons */
        }

        /* Custom Button Styles (re-using from other components where applicable) */
        .delete-category-modal .btn-delete-confirm,
        .delete-category-modal .btn-cancel-modal {
            font-weight: 600;
            border-radius: 2rem !important; /* Rounded pill shape */
            padding: 0.6rem 1.8rem !important; /* Ample padding */
            font-size: 1rem;
            transition: all 0.3s ease;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
            border: none !important; /* Remove default borders */
        }

        .delete-category-modal .btn-delete-confirm {
            background-color: var(--color-danger) !important; /* Red for destructive action */
            color: var(--color-text-light) !important; /* Light text on dark button */
        }

        .delete-category-modal .btn-delete-confirm:hover:not(:disabled) {
            background-color: #c82333 !important; /* Slightly darker red on hover */
            transform: translateY(-2px); /* Slight lift */
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
        }

        .delete-category-modal .btn-delete-confirm:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            background-color: var(--color-danger) !important;
            box-shadow: none !important;
            transform: none !important;
        }

        .delete-category-modal .btn-cancel-modal {
            background-color: transparent !important;
            border: 1px solid var(--color-light) !important; /* Light Periwinkle border */
            color: var(--color-light) !important; /* Light Periwinkle text */
        }

        .delete-category-modal .btn-cancel-modal:hover:not(:disabled) {
            background-color: rgba(255, 255, 255, 0.08) !important; /* Subtle light hover on transparent */
            color: var(--color-lightest) !important; /* Lighter text on hover */
            transform: translateY(-2px); /* Slight lift */
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
        }

        .delete-category-modal .btn-cancel-modal:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            background-color: transparent !important;
            box-shadow: none !important;
            transform: none !important;
        }

        /* Spinner color for consistency */
        .delete-category-modal .spinner-border {
            color: var(--color-text-light) !important; /* Spinner matches text color */
        }
      `}</style>
    </>
  );
}

export default DeleteCategory;