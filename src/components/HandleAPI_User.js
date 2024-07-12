import axios from "axios";
import Swal from "sweetalert2";
import bcrypt from "bcryptjs-react";

const BASE_URL = "http://localhost:4000";

export const fetchProducts = async () => {
  const response = await axios.get(`${BASE_URL}/products`);
  return response.data.payload;
};

export const fetchImageProducts = async (id_product) => {
  const response = await axios.get(`${BASE_URL}/products/image/${id_product}`);
  return response.data.payload;
};

export const fetchProductsByCategory = async (category) => {
  const response = await axios.get(`${BASE_URL}/products/category/${category}`);

  return response.data.payload;
};

export const fetchAllProducts = async (category = "") => {
  let url = `${BASE_URL}/products`;
  if (category) {
    url = `${BASE_URL}/products/category/${category}`;
  }
  const response = await axios.get(url);

  return response.data.payload;
};

export const fetchCategories = async () => {
  const response = await axios.get(`${BASE_URL}/category`);
  return response.data.payload[0];
};

export const fetchProductDetail = async (product) => {
  const response = await axios.get(`${BASE_URL}/products/${product}`);
  return response.data.payload;
};

export const login = async (email, password) => {
  const response = await axios.post(`${BASE_URL}/users/login`, {
    email,
    password,
  });

  localStorage.setItem("token", response.data.token);

  Swal.fire({
    title: "Sukses!",
    text: "Berhasil login.",
    icon: "success",
    confirmButtonText: "OK",
  });

  setTimeout(() => {
    window.location.href = "/";
  }, 1000);
};

export const register = async (username, email, password) => {
  await axios.post(`${BASE_URL}/users/register`, {
    username,
    email,
    password,
  });

  // Optionally handle success message or redirect
  Swal.fire({
    title: "Sukses!",
    text: "Berhasil register.",
    icon: "success",
    confirmButtonText: "OK",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "/login";
    }
  });
};

export const logout = async () => {
  localStorage.removeItem("token");

  // Optionally handle success message or redirect
  Swal.fire({
    title: "Sukses!",
    text: "Berhasil logout.",
    icon: "success",
    confirmButtonText: "OK",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "/login";
    }
  });
};

export const fetchCart = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User not authenticated");
  }

  try {
    const response = await axios.get(`${BASE_URL}/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

export const addToCart = async (product, quantity) => {
  const token = localStorage.getItem("token");

  if (!token) {
    Swal.fire({
      title: "Error!",
      text: "Anda harus login.",
      icon: "error",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/login";
      }
    });
    return;
  }

  const cart = await fetchCart();

  if (!cart) {
    await axios.post(
      `${BASE_URL}/cart/add`,
      {
        id_product: product.id_product,
        quantity: quantity,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    Swal.fire({
      title: "Sukses!",
      text: `${product.product_name} berhasil dimasukan ke keranjang.`,
      icon: "success",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
      }
    });
  } else {
    const productInCart = cart.find(
      (item) => item.id_product === product.id_product
    );
    if (productInCart) {
      const newQuantity = productInCart.quantity + quantity;
      await axios.put(
        `${BASE_URL}/cart/${productInCart.id_cart}`,
        {
          quantity: newQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        title: "Updated!",
        text: `${product.product_name} quantity berhasil diupdate.`,
        icon: "success",
        confirmButtonText: "OK",
      }).then(async (result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    } else {
      await axios.post(
        `${BASE_URL}/cart/add`,
        {
          id_product: product.id_product,
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        title: "Sukses!",
        text: `${product.product_name} berhasil dimasukan ke keranjang.`,
        icon: "success",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    }
  }
};

export const deleteCartItem = async (id_cart) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const result = await Swal.fire({
    title: "Apakah kamu yakin?",
    text: "Apakah kamu yakin menghapus produk ini?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya",
    cancelButtonText: "Tidak",
  });

  if (result.isConfirmed) {
    try {
      axios.delete(`${BASE_URL}/cart/${id_cart}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        title: "Sukses!",
        text: "Berhasil menghapus produk.",
        icon: "success",
        confirmButtonText: "OK",
      });

      window.location.reload();
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Gagal menghapus produk.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  } else {
    Swal.fire({
      title: "Batal",
      text: "Produk batal dihapus",
      icon: "info",
      confirmButtonText: "OK",
    });
  }
};

export const updateCartQuantity = async (id_cart, quantity) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User not authenticated");
  }
  await axios.put(
    `${BASE_URL}/cart/${id_cart}`,
    { quantity },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  window.location.reload();
};

export const fetchUserData = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    Swal.fire({
      title: "Error!",
      text: "Anda harus login.",
      icon: "error",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/login";
      }
    });
    throw new Error("User not authenticated");
  }

  const payload = JSON.parse(atob(token.split(".")[1]));
  const exp = payload.exp;
  if (!exp) {
    throw new Error("Token does not have an expiration time");
  }

  const currentTime = Math.floor(Date.now() / 1000); // current time in seconds
  const isExpired = currentTime > exp;

  if (isExpired) {
    // Optionally handle success message or redirect
    Swal.fire({
      title: "Error!",
      text: "Sesi telah berakhir.",
      icon: "warning",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");

        window.location.href = "/login";
      }
    });
  }

  const response = await axios.get(`${BASE_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateProfile = async (inputData, file) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const { username, email, no_hp, alamat, password } = inputData; // Destructure inputData to get profile details

  // Ensure password is hashed before sending it to the server
  const hashedPassword = await bcrypt.hash(password, 10); // Hash password using bcrypt

  const formData = new FormData();
  if (file) {
    formData.append("image", file); // Append your file here
  }

  // Append other data
  formData.append("username", username);
  formData.append("email", email);
  formData.append("no_hp", no_hp);
  formData.append("alamat", alamat);
  formData.append("password", hashedPassword); // Append hashed password

  try {
    await axios.put(
      `${BASE_URL}/profile/edit`, // Replace with your actual endpoint for updating profile
      formData, // Use formData instead of { username, email, no_hp, password }
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Set content type for FormData
        },
      }
    );

    Swal.fire({
      title: "Sukses!",
      text: "Sukses mengupdate profil.",
      icon: "success",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload(); // Refresh the page after successful update
      }
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new Error("Failed to update profile");
  }
};

export const checkoutCart = async (cartItems, formData) => {
  const token = localStorage.getItem("token");

  if (!token) {
    Swal.fire({
      title: "Error!",
      text: "Anda harus login.",
      icon: "error",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/login";
      }
    });
    return;
  }

  try {
    await axios.post(
      "http://localhost:4000/order/checkout",
      {
        cartItems: cartItems,
        nama_penerima: formData.get("nama_penerima"), // Retrieve fields from formData
        tlp_penerima: formData.get("tlp_penerima"),
        alamat_penerima: formData.get("alamat_penerima"),
        ongkir: formData.get("ongkir"),
        grand_total: formData.get("grand_total"),
        total_bayar: formData.get("total_bayar"),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    Swal.fire({
      title: "Sukses!",
      text: "Berhasil Checkout.",
      icon: "success",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${BASE_URL}/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        window.location.href = "/";
      }
    });
  } catch (error) {
    console.error("Failed to place order:", error);
  }
};

export const fetchOrder = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    Swal.fire({
      title: "Error!",
      text: "Anda harus login.",
      icon: "error",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/login";
      }
    });
    return;
  }

  try {
    const response = await axios.get(`${BASE_URL}/order/transaction`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const detailedData = await Promise.all(
      response.data.payload.map(async (item) => {
        const detailResponse = await axios.get(
          `${BASE_URL}/order/transaction-detail/${item.no_order}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return detailResponse.data.payload;
      })
    );
    return { orderItems: response.data.payload, detailedOrders: detailedData };
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};

export const updateStatusBayar = async (formData, currentOrderId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    Swal.fire({
      title: "Error!",
      text: "Anda harus login.",
      icon: "error",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/login";
      }
    });
    return;
  }

  try {
    const response = await axios.put(
      `${BASE_URL}/order/transaction-detail/edit/${currentOrderId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    Swal.fire({
      title: "Sukses!",
      text: "Berhasil Bayar.",
      icon: "success",
      confirmButtonText: "OK",
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting payment:", error);
  }
};

export const updateStatusDiterima = async (currentOrderId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    Swal.fire({
      title: "Error!",
      text: "Anda harus login.",
      icon: "error",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/login";
      }
    });
    return;
  }

  try {
    const response = await axios.put(
      `${BASE_URL}/order/transaction-detail/edit-diterima/${currentOrderId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    Swal.fire({
      title: "Sukses!",
      text: "Berhasil diterima.",
      icon: "success",
      confirmButtonText: "OK",
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting diterima:", error);
    Swal.fire({
      title: "Error!",
      text: "Gagal memperbarui status.",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
};
