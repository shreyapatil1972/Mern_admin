import React, { useState, useEffect } from "react";
import {
  Table, Badge, Button, InputGroup, FormControl,
  Card, OverlayTrigger, Tooltip, Alert, Image
} from "react-bootstrap";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { getAllCategories } from "../../API/Api";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";
import DeleteCategory from "./DeleteCategory";

// Import the CSS file for this component
import '../../Css/Category.css'; 

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [alert, setAlert] = useState({ show: false, variant: "", message: "" });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  const fetchCategories = async () => {
    const response = await getAllCategories();
    if (response.success) {
      setCategories(response.categories);
      // setFilteredCategories(response.categories); // useEffect handles this
    } else {
      showAlert("danger", "Failed to load categories.");
    }
  };

  const showAlert = (variant, message) => {
    setAlert({ show: true, variant, message });
    setTimeout(() => setAlert({ show: false, variant: "", message: "" }), 3000);
  };

  const handleCategoryUpdated = (success, message) => {
    showAlert(success ? "success" : "danger", message);
    if (success) fetchCategories();
  };

  return (
    <>
      {alert.show && (
        <Alert variant={alert.variant} dismissible onClose={() => setAlert({ show: false })} className="custom-alert">
          {alert.message}
        </Alert>
      )}

      <div className="category-container shadow-sm p-3 rounded">
        <Card className="category-card p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="category-title">Categories</h2>
            <Button
              className="add-category-btn"
              onClick={() => setShowAddModal(true)}
            >
              Add Category
            </Button>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="total-categories-text">
              Total Categories{" "}
              <Badge bg="light" text="dark" className="total-categories-badge">
                {filteredCategories.length}
              </Badge>
            </h6>

            <InputGroup className="category-search-input-group w-50">
              <InputGroup.Text className="category-search-icon">
                <FaSearch />
              </InputGroup.Text>
              <FormControl
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="category-search-control"
              />
            </InputGroup>
          </div>

          <Table responsive bordered hover variant="dark" className="category-table align-middle text-center">
            <thead>
              <tr>
                <th>#</th>
                <th>Category Name</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category, index) => (
                  <tr key={category._id}>
                    <td>{index + 1}</td>
                    <td>{category.name}</td>
                    <td>
                      {category.image ? (
                        <Image
                          src={category.image}
                          alt={category.name}
                          width="100"
                          height="80"
                          className="category-image rounded border"
                        />
                      ) : (
                        <span className="text-muted no-image-text">No Image</span>
                      )}
                    </td>
                    <td>
                      <OverlayTrigger overlay={<Tooltip>Edit Category</Tooltip>}>
                        <Button
                          size="sm"
                          variant="warning"
                          className="edit-category-btn me-2"
                          onClick={() => {
                            setSelectedCategory(category);
                            setShowEditModal(true);
                          }}
                        >
                          <FaEdit />
                        </Button>
                      </OverlayTrigger>

                      <OverlayTrigger overlay={<Tooltip>Delete Category</Tooltip>}>
                        <Button
                          size="sm"
                          variant="danger"
                          className="delete-category-btn"
                          onClick={() => {
                            setSelectedCategoryId(category._id);
                            setShowDeleteModal(true);
                          }}
                        >
                          <FaTrash />
                        </Button>
                      </OverlayTrigger>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-muted no-categories-found">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card>
      </div>

      {/* Modals */}
      <AddCategory
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onCategoryAdded={() => {
          fetchCategories();
          showAlert("success", "Category added successfully!");
        }}
      />

      <EditCategory
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        category={selectedCategory}
        onCategoryUpdated={handleCategoryUpdated}
      />

      <DeleteCategory
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        // Ensure this prop name matches what DeleteCategory expects, e.g., 'categoryId'
        // based on your DeleteProduct and EditProduct components.
        // Assuming your backend uses categoryId
        categoryId={selectedCategoryId} 
        onCategoryDelete={handleCategoryUpdated}
      />
    </>
  );
};

export default Category;