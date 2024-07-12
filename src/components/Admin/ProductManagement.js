import React, { useState, useEffect } from "react";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import "../../css/AdminManagement.css";
import ReactQuill from "react-quill"; // Import ReactQuill component

import {
  fetchProducts,
  updateProduct,
  deleteProduct,
  createProduct,
  fetchCategories, // Import fetchCategories function
} from "./HandleAPI_Admin";

const ProductManagement = () => {
  const [products, setProducts] = useState(null);
  const [categories, setCategories] = useState(null); // State to hold categories
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // State to hold selected product for editing
  const [newProduct, setNewProduct] = useState({
    product_name: "",
    description: "",
    price: "",
    stock: "",
    id_category: "", // Initialize id_category state
  });
  const [file, setFile] = useState(null); // State to hold selected file
  const [error, setError] = useState("");

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await fetchProducts();
        const categoriesData = await fetchCategories();

        const mergedProducts = productsData.map((product) => {
          const category = categoriesData.find(
            (cat) => cat.id_category === product.id_category
          );
          return {
            ...product,
            category_name: category ? category.category_name : "Unknown",
          };
        });

        setProducts(mergedProducts);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data product & category", error);
      }
    };
    fetchData();
  }, []);

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setFile(null);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedProduct(null);
    setEditModalOpen(false);
  };

  const openCreateModal = () => {
    setFile(null);
    setCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setCreateModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (selectedProduct) {
      setSelectedProduct({
        ...selectedProduct,
        [name]: value,
      });
    } else {
      setNewProduct({
        ...newProduct,
        [name]: value,
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleDeleteProduct = async (id_product) => {
    await deleteProduct(id_product);

    const productsData = await fetchProducts();
    setProducts(productsData);
  };

  const handleSubmitEdit = async () => {
    if (
      !selectedProduct.product_name ||
      !selectedProduct.description ||
      !selectedProduct.price ||
      !selectedProduct.stock
    ) {
      setError("Please fill out all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("id_product", selectedProduct.id_product);
    formData.append("product_name", selectedProduct.product_name);
    formData.append("description", selectedProduct.description);
    formData.append("price", selectedProduct.price);
    formData.append("stock", selectedProduct.stock);
    formData.append("id_category", selectedProduct.id_category);

    if (file) {
      formData.append("image", file);
    }

    try {
      const updateProducts = await updateProduct(formData);
      if (updateProducts.payload.isSuccess) {
        const productsData = await fetchProducts();
        const categoriesData = await fetchCategories();

        const mergedProducts = productsData.map((product) => {
          const category = categoriesData.find(
            (cat) => cat.id_category === product.id_category
          );
          return {
            ...product,
            category_name: category ? category.category_name : "Unknown",
          };
        });

        setProducts(mergedProducts);
      }

      closeEditModal();
    } catch (error) {
      alert("Failed to update product");
    }
  };

  const handleSubmitCreate = async () => {
    if (
      !newProduct.product_name ||
      !newProduct.description ||
      !newProduct.price ||
      !newProduct.stock ||
      !newProduct.id_category ||
      !file
    ) {
      setError("Please fill out all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("product_name", newProduct.product_name);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price);
    formData.append("stock", newProduct.stock);
    formData.append("id_category", newProduct.id_category);

    if (file) {
      formData.append("image", file);
    }

    try {
      const createProducts = await createProduct(formData);
      if (createProducts.payload.isSuccess) {
        const productsData = await fetchProducts();
        const categoriesData = await fetchCategories();

        const mergedProducts = productsData.map((product) => {
          const category = categoriesData.find(
            (cat) => cat.id_category === product.id_category
          );
          return {
            ...product,
            category_name: category ? category.category_name : "Unknown",
          };
        });

        setProducts(mergedProducts);
      }
      closeCreateModal();
    } catch (error) {
      alert("Failed to create product");
    }
  };
  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["clean"],
    ],
  };

  const formats = [
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
  ];

  if (!products || !categories) {
    return; // or loading indicator
  }
  const maxLength = 150; // Maximum length of description to show

  // Function to truncate the description
  const truncateDescription = (description) => {
    if (description.length <= maxLength) {
      return description;
    }
    return `${description.substring(0, maxLength)}...`;
  };
  return (
    <div className="container-fluid container-admin">
      <h2>Kelola Produk</h2>
      <button className="btn btn-create-admin mb-4" onClick={openCreateModal}>
        Tambah Produk
      </button>
      <div className="table-responsive">
        <table className="table table-admin">
          <thead className="thead-light">
            <tr>
              <th>Id Produk</th>
              <th>Nama Produk</th>
              <th>Deskripsi</th>
              <th>Harga</th>
              <th>Stok</th>
              <th>Kategori</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id_product}>
                <td>{product.id_product}</td>
                <td>{product.product_name}</td>
                <td>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: truncateDescription(product.description),
                    }}
                  />
                </td>
                <td>{formatter.format(product.price)}</td>
                <td>{product.stock}</td>
                <td>{product.category_name}</td>
                <td>
                  <button
                    className="btn btn-success btn-edit"
                    onClick={() => openEditModal(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-delete"
                    onClick={() => handleDeleteProduct(product.id_product)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Product Modal */}
      {editModalOpen && selectedProduct && (
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
                  <div className="col-lg-8">
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form>
                      <div className="form-group">
                        <label>Nama:</label>
                        <input
                          type="text"
                          name="product_name"
                          value={selectedProduct.product_name}
                          onChange={handleInputChange}
                          className="form-control"
                        />
                      </div>
                      <div className="form-group">
                        <label>Deskripsi:</label>
                        <ReactQuill
                          value={selectedProduct.description}
                          onChange={(value) =>
                            handleInputChange({
                              target: {
                                name: "description",
                                value,
                              },
                            })
                          }
                          modules={modules}
                          formats={formats}
                        />
                      </div>
                      <div className="form-group">
                        <label>Harga:</label>
                        <input
                          type="number"
                          name="price"
                          value={selectedProduct.price}
                          onChange={handleInputChange}
                          className="form-control"
                        />
                      </div>
                      <div className="form-group">
                        <label>Stok:</label>
                        <input
                          type="number"
                          name="stock"
                          value={selectedProduct.stock}
                          onChange={handleInputChange}
                          className="form-control"
                        />
                      </div>
                      <div className="form-group">
                        <label>Kategori:</label>
                        <select
                          name="id_category"
                          value={selectedProduct.id_category}
                          onChange={handleInputChange}
                          className="form-control"
                        >
                          <option value="">Pilih Kategori</option>
                          {categories.map((category) => (
                            <option
                              key={category.id_category}
                              value={category.id_category}
                            >
                              {category.category_name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Foto Produk:</label>
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
                  <div className="col-lg-4">
                    {file ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        className="img-fluid"
                      />
                    ) : (
                      <img
                        src={`http://localhost:4000${selectedProduct.image}`}
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

      {/* Create Product Modal */}
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
                <h5 className="modal-title">Tambah Produk</h5>
                <button
                  className="btn-close"
                  type="button"
                  onClick={closeCreateModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className={!file ? "col-12" : "col-lg-7"}>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form>
                      <div className="form-group">
                        <label>Nama:</label>
                        <input
                          type="text"
                          name="product_name"
                          value={newProduct.product_name}
                          onChange={handleInputChange}
                          className="form-control"
                        />
                      </div>
                      <div className="form-group">
                        <label>Deskripsi:</label>
                        <ReactQuill
                          value={newProduct.description}
                          onChange={(value) =>
                            handleInputChange({
                              target: {
                                name: "description",
                                value,
                              },
                            })
                          }
                          modules={modules}
                          formats={formats}
                        />
                      </div>
                      <div className="form-group">
                        <label>Harga:</label>
                        <input
                          type="number"
                          name="price"
                          value={newProduct.price}
                          onChange={handleInputChange}
                          className="form-control"
                        />
                      </div>
                      <div className="form-group">
                        <label>Stok:</label>
                        <input
                          type="number"
                          name="stock"
                          value={newProduct.stock}
                          onChange={handleInputChange}
                          className="form-control"
                        />
                      </div>
                      <div className="form-group">
                        <label>Kategori:</label>
                        <select
                          name="id_category"
                          value={newProduct.id_category}
                          onChange={handleInputChange}
                          className="form-control"
                        >
                          <option value="" disabled>
                            Pilih Kategori
                          </option>
                          {categories.map((category) => (
                            <option
                              key={category.id_category}
                              value={category.id_category}
                            >
                              {category.category_name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Foto Produk:</label>
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="form-control"
                        />
                      </div>
                      <button
                        type="button"
                        className="btn btn-edit-admin"
                        onClick={handleSubmitCreate}
                      >
                        Tambah Produk
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

export default ProductManagement;
