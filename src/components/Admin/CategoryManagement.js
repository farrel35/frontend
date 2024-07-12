import React, { useState, useEffect } from "react";
import "../../css/AdminManagement.css";

import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./HandleAPI_Admin";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const [selectedCategory, setSelectedCategory] = useState(null);

  const [newCategory, setNewCategory] = useState({
    category_name: "",
    categorys: "", // Check if this should be `category_code` or similar
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (selectedCategory) {
      setSelectedCategory({
        ...selectedCategory,
        [name]: value,
      });
    } else {
      setNewCategory({
        ...newCategory,
        [name]: value,
      });
    }
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setFile(null);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedCategory(null);
    setEditModalOpen(false);
  };

  const openCreateModal = () => {
    setFile(null);
    setCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setCreateModalOpen(false);
    setError(""); // Clear error on modal close
    setNewCategory({
      category_name: "",
      categorys: "",
    });
    setFile(null); // Reset file state on modal close
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleDeleteCategory = async (id_category) => {
    const deleteCategorys = await deleteCategory(id_category);
    if (deleteCategorys.payload.isSuccess) {
      const categoriesData = await fetchCategories();
      setCategories(categoriesData);
    }
  };

  const handleSubmitEdit = async () => {
    if (!selectedCategory.category_name || !selectedCategory.categorys) {
      setError("Please fill out all required fields.");
      return;
    }
    const formData = new FormData();
    formData.append("id_category", selectedCategory.id_category);
    formData.append("category_name", selectedCategory.category_name);
    formData.append("categorys", selectedCategory.categorys);

    if (file) {
      formData.append("image", file);
    }

    try {
      const updateCategorys = await updateCategory(formData);
      if (updateCategorys.payload.isSuccess) {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      }
      closeEditModal();
    } catch (error) {
      alert("Failed to update category");
    }
  };

  const handleSubmitCreate = async () => {
    if (!newCategory.category_name || !newCategory.categorys || !file) {
      setError("Please fill out all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("category_name", newCategory.category_name);
    formData.append("categorys", newCategory.categorys);

    if (file) {
      formData.append("image", file);
    }

    try {
      const createCategorys = await createCategory(formData);
      if (createCategorys.payload.isSuccess) {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      }
      closeCreateModal();
    } catch (error) {
      alert("Failed to create category");
    }
  };

  if (!categories) {
    return;
  }

  return (
    <div className="container-fluid container-admin">
      <h2>Kelola Kategori</h2>
      <button className="btn btn-create-admin mb-4" onClick={openCreateModal}>
        Tambah Kategori
      </button>
      <div className="table-responsive">
        <table className="table table-admin">
          <thead className="thead-light">
            <tr>
              <th>Kode Kategori</th>
              <th>Nama Kategori</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id_category}>
                <td>{category.categorys}</td>
                <td>{category.category_name}</td>
                <td>
                  <button
                    className="btn btn-success btn-edit"
                    onClick={() => openEditModal(category)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-delete"
                    onClick={() => handleDeleteCategory(category.id_category)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editModalOpen && selectedCategory && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            paddingLeft: "17px",
          }}
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Produk</h5>
                <button
                  className="btn-close"
                  type="button"
                  onClick={closeEditModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-7">
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form>
                      <div className="form-group">
                        <label>Nama Kategori:</label>
                        <input
                          type="text"
                          name="category_name"
                          value={selectedCategory.category_name}
                          onChange={handleInputChange}
                          className="form-control"
                        />
                      </div>
                      <div className="form-group">
                        <label>Kode Kategori:</label>
                        <input
                          type="text"
                          name="categorys"
                          value={selectedCategory.categorys}
                          onChange={handleInputChange}
                          className="form-control"
                        />
                      </div>
                      <div className="form-group">
                        <label>Category Image:</label>
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="form-control"
                        />
                      </div>

                      <button
                        type="button"
                        className="btn btn-edit-admin"
                        onClick={handleSubmitEdit}
                      >
                        Simpan
                      </button>
                    </form>
                  </div>
                  <div className="col-lg-5">
                    {file ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        className="img-fluid"
                      />
                    ) : (
                      <img
                        src={`http://localhost:4000${selectedCategory.image}`}
                        alt="Default Preview"
                        className="img-fluid"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {createModalOpen && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            paddingLeft: "17px",
          }}
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Tambah Kategori</h5>
                <button
                  className="btn-close"
                  type="button"
                  onClick={closeCreateModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className={!file ? "col-12" : "col-lg-7"}>
                    <form>
                      <div className="form-group">
                        <label>Kode Kategori:</label>
                        <input
                          type="text"
                          name="categorys"
                          value={newCategory.categorys}
                          onChange={handleInputChange}
                          className="form-control"
                        />
                      </div>
                      <div className="form-group">
                        <label>Nama Kategori:</label>
                        <input
                          type="text"
                          name="category_name"
                          value={newCategory.category_name}
                          onChange={handleInputChange}
                          className="form-control"
                        />
                      </div>
                      <div className="form-group">
                        <label>Foto Kategori:</label>
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="form-control"
                        />
                      </div>

                      {error && (
                        <div className="alert alert-danger">{error}</div>
                      )}

                      <button
                        type="button"
                        className="btn btn-edit-admin"
                        onClick={handleSubmitCreate}
                      >
                        Tambah Kategori
                      </button>
                    </form>
                  </div>
                  {file && (
                    <div className="col-lg-5">
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        className="img-fluid"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
