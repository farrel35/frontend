import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../css/Order.css";
import {
  fetchOrder,
  updateStatusBayar,
  updateStatusDiterima,
} from "./HandleAPI_User";
import Swal from "sweetalert2";

const Order = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [detailedOrders, setDetailedOrders] = useState([]);
  const [bayarModalOpen, setBayarModalOpen] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const [buktiBayar, setBuktiBayar] = useState({
    bankName: "",
    accountOwner: "",
    accountNumber: "",
  });

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBuktiBayar((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const openBayarModal = (id_product) => {
    setCurrentOrderId(id_product);
    setBayarModalOpen(true);
  };

  const closeBayarModal = () => {
    setCurrentOrderId(null);
    setBayarModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !buktiBayar.bankName ||
      !buktiBayar.accountOwner ||
      !buktiBayar.accountNumber ||
      !file
    ) {
      setError("All fields are required.");
      return;
    }
    setError("");

    const formData = new FormData();
    formData.append("nama_bank", buktiBayar.bankName);
    formData.append("atas_nama", buktiBayar.accountOwner);
    formData.append("no_rekening", buktiBayar.accountNumber);
    formData.append("image", file);

    const update = await updateStatusBayar(formData, currentOrderId);
    if (update) {
      const fetchData = async () => {
        try {
          const { orderItems, detailedOrders } = await fetchOrder();
          setOrderItems(orderItems);
          setDetailedOrders(detailedOrders);
        } catch (error) {
          console.error("Error fetching data ", error);
        }
      };

      fetchData();
    }
    closeBayarModal();
  };

  const handleDiterima = async (noOrder) => {
    const result = await Swal.fire({
      title: "Apakah kamu yakin?",
      text: "Apakah kamu yakin menerima produk ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
    });

    if (result.isConfirmed) {
      const update = await updateStatusDiterima(noOrder);
      if (update) {
        const fetchData = async () => {
          try {
            const { orderItems, detailedOrders } = await fetchOrder();
            setOrderItems(orderItems);
            setDetailedOrders(detailedOrders);
          } catch (error) {
            console.error("Error fetching data ", error);
          }
        };

        await fetchData();

        Swal.fire({
          title: "Sukses!",
          text: "Berhasil diterima.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
      closeBayarModal();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { orderItems, detailedOrders } = await fetchOrder();
        setOrderItems(orderItems);
        setDetailedOrders(detailedOrders);
      } catch (error) {
        console.error("Error fetching data ", error);
      }
    };

    fetchData();
  }, []);
  if (!orderItems || !detailedOrders) {
    return;
  }
  return (
    <>
      <Navbar />
      <div className="app-container">
        <div className="content-wrap">
          <div className="container py-5 h-100 mt-5">
            <div className="card card-primary card-outline card-outline-tabs">
              <div className="card-header border-bottom-0">
                <h1 className="text-center">Pesanan Saya</h1>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>No Order</th>
                        <th className="text-center">Tanggal Order</th>
                        <th className="text-center">Detail Pesanan</th>
                        <th className="text-center">Total Bayar</th>
                        <th className="text-center">Alamat</th>
                        <th className="text-center">Status</th>
                        <th className="text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderItems.map((item, index) => (
                        <tr key={item.no_order}>
                          <td>{item.no_order}</td>
                          <td className="text-center">
                            <small className="opacity-50 text-nowrap">
                              {new Date(item.order_date).toLocaleDateString()}
                            </small>
                          </td>
                          <td className="text-center">
                            {detailedOrders[index] &&
                              detailedOrders[index].map((detail) => (
                                <div key={detail.id_detail}>
                                  <img
                                    alt="Product"
                                    className="flex-shrink-0"
                                    height="64"
                                    src={`http://localhost:4000${detail.image}`}
                                    width="64"
                                  />
                                  {detail.product_name} x {detail.quantity}
                                </div>
                              ))}
                          </td>
                          <td className="text-center">
                            {formatter.format(item.total_bayar)}
                          </td>
                          <td>
                            <div>
                              <b>Nama Penerima :</b> {item.nama_penerima}
                            </div>
                            <div>
                              <b>No Penerima :</b> {item.tlp_penerima}
                            </div>
                            <div>
                              <b>Alamat Penerima :</b> {item.alamat_penerima}
                            </div>
                            <div>
                              {item.status_bayar === 1 &&
                                item.status_order === 2 && (
                                  <div>
                                    <b>No Resi :</b> {item.no_resi}
                                  </div>
                                )}
                            </div>
                          </td>
                          <td className="text-center">
                            {item.status_bayar === 0 &&
                            item.status_order === 0 ? (
                              <span className="badge text-bg-warning">
                                Belum Bayar
                              </span>
                            ) : item.status_bayar === 1 &&
                              item.status_order === 0 ? (
                              <span className="badge text-bg-success">
                                Menunggu Verifikasi
                              </span>
                            ) : item.status_bayar === 1 &&
                              item.status_order === 1 ? (
                              <span className="badge text-bg-warning">
                                Dikemas
                              </span>
                            ) : item.status_bayar === 1 &&
                              item.status_order === 2 ? (
                              <span className="badge text-bg-success">
                                Dikirim
                              </span>
                            ) : item.status_bayar === 1 &&
                              item.status_order === 3 ? (
                              <span className="badge text-bg-primary">
                                Diterima
                              </span>
                            ) : null}
                          </td>
                          <td className="text-center">
                            {item.status_bayar === 0 &&
                            item.status_order === 0 ? (
                              <button
                                type="button"
                                className="bayar-button"
                                onClick={() => openBayarModal(item.no_order)}
                              >
                                Bayar Sekarang
                              </button>
                            ) : item.status_bayar === 1 &&
                              item.status_order === 2 ? (
                              <div>
                                <button
                                  type="button"
                                  className="bayar-button"
                                  onClick={() => handleDiterima(item.no_order)}
                                >
                                  Diterima
                                </button>
                              </div>
                            ) : null}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {bayarModalOpen && (
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
                    <h4 className="modal-title">
                      {
                        orderItems.find(
                          (item) => item.no_order === currentOrderId
                        ).no_order
                      }
                    </h4>
                    <button
                      className="btn-close"
                      type="button"
                      onClick={closeBayarModal}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-6">
                        <div className="card card-primary">
                          <div className="card-header">
                            <h3 className="card-title">No Rekening</h3>
                          </div>
                          <div className="card-body">
                            <div className="form-group">
                              <p>
                                Silahkan transfer ke nomor rekening berikut
                                sejumlah :
                              </p>
                              <h1 className="text-primary">
                                {formatter.format(
                                  orderItems.find(
                                    (item) => item.no_order === currentOrderId
                                  ).total_bayar
                                )}
                              </h1>
                              <p />
                              <table className="table">
                                <tbody>
                                  <tr>
                                    <th>Bank</th>
                                    <th>No Rekening</th>
                                    <th>Atas Nama</th>
                                  </tr>
                                  <tr>
                                    <td>Bank Mandiri</td>
                                    <td>132-003600-0009</td>
                                    <td>Mebelin Furniture</td>
                                  </tr>
                                  <tr>
                                    <td>Bank Central Asia (BCA)</td>
                                    <td>6280-66-9600</td>
                                    <td>Mebelin Furniture</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="card card-primary">
                          <div className="card-body">
                            {error && (
                              <div className="alert alert-danger">{error}</div>
                            )}

                            <form onSubmit={handleSubmit}>
                              <div className="form-group">
                                <label>Nama Bank:</label>
                                <input
                                  type="text"
                                  name="bankName"
                                  className="form-control"
                                  onChange={handleInputChange}
                                />
                                <label>Nama Pemilik Rekening:</label>
                                <input
                                  type="text"
                                  name="accountOwner"
                                  className="form-control"
                                  onChange={handleInputChange}
                                />
                                <label>No rekening:</label>
                                <input
                                  type="text"
                                  name="accountNumber"
                                  className="form-control"
                                  onChange={handleInputChange}
                                />

                                <label>Bukti Bayar:</label>
                                <input
                                  type="file"
                                  className="form-control"
                                  onChange={handleFileChange}
                                />
                              </div>

                              <button type="submit" className="btn btn-bayar">
                                Bayar
                              </button>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Order;
