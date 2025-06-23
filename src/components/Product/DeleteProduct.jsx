import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { deleteproduct } from '../../API/Api'; // Ensure path is correct

function DeleteProduct({ show, onHide, productId, onProductDelete }) {

  // Define your color palette as JavaScript objects here
  // These should ideally come from a central theme context or CSS variables
  const colors = {
    lightest: '#FFF2F2',    // Pale Pink/Off-White
    light: '#A9B5DF',     // Light Periwinkle/Dusty Blue
    medium: '#7886C7',    // Medium Periwinkle/Lavender Blue (Often used as accent)
    dark: '#2D336B',      // Deep Navy/Indigo
    textDark: '#2D336B',  // General text color
    textLight: '#FFF2F2', // Text on dark backgrounds
    danger: '#e74c3c',    // Standard red for danger
    warning: '#f39c12',   // Standard orange for warning
    accent: '#C19A6B',    // This was used in your original inline styles for headers/buttons
    modalBgDark: '#0D0D0D', // Your specific dark background for modal header/footer
    modalBodyBgDark: '#1c1c1c', // Your specific dark background for modal body
  };

  // Define style objects for your components
  const modalContentStyle = {
    borderRadius: '1rem',
    overflow: 'hidden',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
  };

  const modalHeaderStyle = {
    backgroundColor: colors.dark, // Changed from #0D0D0D to use your dark theme color
    color: colors.light, // Light Periwinkle for title
    borderBottom: `1px solid ${colors.medium}`, // Accent border
    padding: '1.5rem 2rem',
  };

  const modalTitleStyle = {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: colors.light, // Light Periwinkle for title
    letterSpacing: '0.5px',
  };

  const modalBodyStyle = {
    backgroundColor: colors.lightest, // Pale Pink/Off-White for body for better readability
    color: colors.textDark, // Deep Navy text
    padding: '2rem 2.5rem',
    lineHeight: '1.6',
    fontSize: '1.1rem',
  };

  const modalFooterStyle = {
    backgroundColor: colors.dark, // Deep Navy
    borderTop: `1px solid ${colors.medium}`, // Accent border
    padding: '1.5rem 2rem',
    justifyContent: 'flex-end',
  };

  const deleteButtonStyle = {
    backgroundColor: colors.danger, // Use your defined danger color
    color: colors.textLight, // Light text for contrast
    border: 'none',
    fontWeight: '600', // Increased font weight
    padding: '0.6rem 1.8rem', // Ample padding
    borderRadius: '2rem', // Rounded pill shape
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
  };

  // Note: Pure inline styles don't directly support :hover, :focus.
  // For hover effects, you'd typically need a CSS stylesheet or a CSS-in-JS library.
  // The hover effect below is a workaround, typically not used for complex interactions.
  // For simplicity and direct inline application, we'll keep it as is.

  const cancelButtonStyle = {
    backgroundColor: 'transparent',
    border: `1px solid ${colors.light}`, // Light Periwinkle border
    color: colors.light, // Light Periwinkle text
    fontWeight: '600',
    padding: '0.6rem 1.8rem',
    borderRadius: '2rem',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
  };


  const handleDeleteProduct = async () => {
    try {
      const response = await deleteproduct(productId);
      if (response.success) {
        onProductDelete(true, 'Product deleted successfully!');
      } else {
        onProductDelete(false, response.message || 'Failed to delete product.');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      onProductDelete(false, 'An error occurred while deleting the product.');
    } finally {
      onHide(); // Always close modal after action
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered style={modalContentStyle}> {/* Apply modalContentStyle here */}
      <Modal.Header closeButton style={modalHeaderStyle}>
        <Modal.Title style={modalTitleStyle}>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body style={modalBodyStyle}>
        Are you sure you want to delete this product? This action <strong style={{color: colors.danger}}>cannot be undone</strong>.
      </Modal.Body>
      <Modal.Footer style={modalFooterStyle}>
        <Button
          style={deleteButtonStyle}
          onClick={handleDeleteProduct}
        >
          Delete
        </Button>
        <Button
          style={cancelButtonStyle}
          onClick={onHide}
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteProduct;