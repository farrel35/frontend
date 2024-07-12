// src/components/Admin/OrderManagement.js
import React, { useState, useEffect } from "react";
import "../../css/AdminManagement.css";
import { fetchOrder, updateStatusOrder } from "./HandleAPI_Admin";

const OrderManagement = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [detailedOrders, setDetailedOrders] = useState([]);
  const [buktibayarModalOpen, setBuktiBayarModalOpen] = useState(false);
  const [kirimModalOpen, setKirimModalOpen] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [noResi, setNoResi] = useState("");

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  const openBuktiBayarModal = (no_order) => {
    setCurrentOrderId(no_order);
    setBuktiBayarModalOpen(true);
  };

  const closeBuktiBayarModal = () => {
    setCurrentOrderId(null);
    setBuktiBayarModalOpen(false);
  };

  const openKirimModal = (no_order) => {
    setNoResi("");
    setCurrentOrderId(no_order);
    setKirimModalOpen(true);
  };

  const closeKirimModal = () => {
    setCurrentOrderId(null);
    setKirimModalOpen(false);
  };

  const prosesOrder = async (no_order) => {
    const update = await updateStatusOrder(1, no_order, noResi);
    if (update) {
      const fetchData = async () => {
        try {
          const { orderItems, detailedOrders } = await fetchOrder();
          setOrderItems(orderItems);
          setDetailedOrders(detailedOrders);
        } catch (error) {
          console.error("Error fetching data", error);
        }
      };

      fetchData();
    }
  };

  const prosesKirim = async (no_order, noResi) => {
    const update = await updateStatusOrder(2, no_order, noResi);
    if (update) {
      const fetchData = async () => {
        try {
          const { orderItems, detailedOrders } = await fetchOrder();
          setOrderItems(orderItems);
          setDetailedOrders(detailedOrders);
        } catch (error) {
          console.error("Error fetching data", error);
        }
      };

      fetchData();
    }
    closeKirimModal();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { orderItems, detailedOrders } = await fetchOrder();
        setOrderItems(orderItems);
        setDetailedOrders(detailedOrders);
      } catch (error) {
        console.error("Error fetching data product & category", error);
      }
    };

    fetchData();
  }, []);

  if (!orderItems || !detailedOrders) {
    return;
  }

  return (
    <div className="container-fluid container-admin">
      <h2>Kelola Order</h2>

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
                    {item.status_bayar === 1 && item.status_order === 2 && (
                      <div>
                        <b>No Resi :</b> {item.no_resi}
                      </div>
                    )}
                  </div>
                </td>
                <td className="text-center">
                  {item.status_bayar === 0 && item.status_order === 0 ? (
                    <span className="badge text-bg-warning">Belum Bayar</span>
                  ) : item.status_bayar === 1 && item.status_order === 0 ? (
                    <span className="badge text-bg-success">
                      Menunggu Verifikasi
                    </span>
                  ) : item.status_bayar === 1 && item.status_order === 1 ? (
                    <span className="badge text-bg-warning">Dikemas</span>
                  ) : item.status_bayar === 1 && item.status_order === 2 ? (
                    <span className="badge text-bg-success">Dikirim</span>
                  ) : item.status_bayar === 1 && item.status_order === 3 ? (
                    <span className="badge text-bg-primary">Diterima</span>
                  ) : null}
                </td>
                <td className="text-center">
                  {item.status_bayar === 1 && item.status_order === 0 ? (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <button
                        type="button"
                        className="bayar-button"
                        style={{ marginBottom: "10px" }}
                        onClick={() => openBuktiBayarModal(item.no_order)}
                      >
                        Lihat Bukti Bayar
                      </button>
                      <button
                        type="button"
                        className="bayar-button"
                        style={{ marginBottom: "10px" }}
                        onClick={() => prosesOrder(item.no_order)}
                      >
                        Proses
                      </button>
                    </div>
                  ) : item.status_bayar === 1 && item.status_order === 1 ? (
                    <button
                      type="button"
                      className="bayar-button"
                      style={{ marginBottom: "10px" }}
                      onClick={() => openKirimModal(item.no_order)}
                    >
                      Kirim
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {buktibayarModalOpen && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            paddingLeft: "17px",
          }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">
                  {
                    orderItems.find((item) => item.no_order === currentOrderId)
                      .no_order
                  }
                </h4>
                <button
                  className="btn-close"
                  type="button"
                  onClick={closeBuktiBayarModal}
                ></button>
              </div>
              <div className="modal-body">
                <table className="table">
                  <tbody>
                    <tr>
                      <th>Nama Bank</th>
                      <th>:</th>
                      <td>
                        {
                          orderItems.find(
                            (item) => item.no_order === currentOrderId
                          ).nama_bank
                        }
                      </td>
                    </tr>
                    <tr>
                      <th>Nama Pemilik Rekening</th>
                      <th>:</th>
                      <td>
                        {
                          orderItems.find(
                            (item) => item.no_order === currentOrderId
                          ).atas_nama
                        }
                      </td>
                    </tr>
                    <tr>
                      <th>No Rekening</th>
                      <th>:</th>
                      <td>
                        {
                          orderItems.find(
                            (item) => item.no_order === currentOrderId
                          ).no_rekening
                        }
                      </td>
                    </tr>
                    <tr>
                      <th>Total Bayar</th>
                      <th>:</th>
                      <td>
                        {formatter.format(
                          orderItems.find(
                            (item) => item.no_order === currentOrderId
                          ).total_bayar
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <img
                  alt=""
                  className="img-fluid pad img-cent"
                  src={`http://localhost:4000${
                    orderItems.find((item) => item.no_order === currentOrderId)
                      .image_bayar
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {kirimModalOpen && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            paddingLeft: "17px",
          }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">
                  {
                    orderItems.find((item) => item.no_order === currentOrderId)
                      .no_order
                  }
                </h4>
                <button
                  className="btn-close"
                  type="button"
                  onClick={closeKirimModal}
                ></button>
              </div>
              <div className="modal-body">
                <table className="table">
                  <tbody>
                    <tr>
                      <th>Nama Penerima</th>
                      <th>:</th>
                      <td>
                        {
                          orderItems.find(
                            (item) => item.no_order === currentOrderId
                          ).nama_penerima
                        }
                      </td>
                    </tr>
                    <tr>
                      <th>No Penerima</th>
                      <th>:</th>
                      <td>
                        {
                          orderItems.find(
                            (item) => item.no_order === currentOrderId
                          ).tlp_penerima
                        }
                      </td>
                    </tr>
                    <tr>
                      <th>Alamat Penerima</th>
                      <th>:</th>
                      <td>
                        {
                          orderItems.find(
                            (item) => item.no_order === currentOrderId
                          ).alamat_penerima
                        }
                      </td>
                    </tr>
                    <tr>
                      <th>Biaya Ongkir</th>
                      <th>:</th>
                      <td>
                        {formatter.format(
                          orderItems.find(
                            (item) => item.no_order === currentOrderId
                          ).ongkir
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>No Resi</th>
                      <th>:</th>
                      <td>
                        <input
                          className="form-control"
                          name="no_resi"
                          value={noResi}
                          onChange={(e) => setNoResi(e.target.value)}
                          placeholder="Masukan no resi"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="text-end">
                  <button
                    className="bayar-button"
                    onClick={() => {
                      const no_order = orderItems.find(
                        (item) => item.no_order === currentOrderId
                      )?.no_order;
                      prosesKirim(no_order, noResi);
                    }}
                  >
                    Kirim
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
