import React, { useState, useEffect } from "react";
import "../../css/AdminManagement.css";

import {
  fetchProducts,
  fetchImageProducts,
  deleteImageProducts,
  addImageProducts,
} from "./HandleAPI_Admin";

const ProductImageManagement = () => {
  const [products, setProducts] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productsImage, setProductsImage] = useState([]);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const openAddModal = async (id_product) => {
    setFile(null);
    setSelectedProduct(id_product);
    try {
      const imageProduct = await fetchImageProducts(id_product);
      setProductsImage(imageProduct);
      setAddModalOpen(true);
    } catch (error) {
      console.error("Error fetching image products", error);
    }
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
  };

  const handleDeleteImageProduct = async (imageId) => {
    try {
      await deleteImageProducts(imageId);
      const updatedImages = productsImage.filter(
        (img) => img.id_image !== imageId
      );
      setProductsImage(updatedImages);
    } catch (error) {
      console.error("Error deleting image product", error);
    }
  };

  const handleSubmit = async () => {
    if (!file || !description) {
      setError("Keterangan dan foto harus diisi.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("keterangan", description);
    formData.append("id_product", selectedProduct);

    try {
      await addImageProducts(formData);
      setError("");
      setFile(null);
      setDescription("");

      const imageProduct = await fetchImageProducts(selectedProduct);
      setProductsImage(imageProduct);
    } catch (error) {
      setError("Error uploading image.");
      console.error("Error uploading image", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await fetchProducts();
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };
    fetchData();
  }, []);

  if (!products) {
    return;
  }

  return (
    <div className="container-fluid container-admin">
      <h2>Kelola Produk</h2>
      <div className="table-responsive">
        <table className="table table-admin">
          <thead className="thead-light">
            <tr>
              <th>Id Produk</th>
              <th>Nama Produk</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id_product}>
                <td>{product.id_product}</td>
                <td>{product.product_name}</td>
                <td>
                  <button
                    className="btn btn-success btn-edit"
                    onClick={() => openAddModal(product.id_product)}
                  >
                    Tambah Foto
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {addModalOpen && (
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
                  onClick={closeAddModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className={!file ? "col-12" : "col-lg-7"}>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form>
                      <div className="form-group">
                        <label>Keterangan:</label>
                        <input
                          type="text"
                          name="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="form-control"
                        />
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
                        onClick={handleSubmit}
                      >
                        Tambah Foto
                      </button>
                    </form>
                    <div className="list-group">
                      {productsImage.map((img) => (
                        <div
                          key={img.id_image}
                          className="list-group-item list-group-item-action d-flex gap-3 py-3"
                        >
                          <img
                            src={`http://localhost:4000${img.image}`}
                            alt="Product"
                            width={128}
                            height={128}
                            className="flex-shrink-0"
                          />
                          <div className="d-flex gap-2 w-100 justify-content-between align-items-center">
                            <div>
                              <h6 className="mb-0">
                                <b>Keterangan</b>
                              </h6>
                              <p className="mb-0 opacity-75">
                                {img.keterangan}
                              </p>
                            </div>
                            <div className="d-flex align-items-center">
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() =>
                                  handleDeleteImageProduct(img.id_image)
                                }
                              >
                                Hapus
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
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

export default ProductImageManagement;
