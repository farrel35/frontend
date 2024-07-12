import React, { useState, useRef, useEffect } from "react";
import "../css/Profile.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { fetchUserData, updateProfile } from "./HandleAPI_User";

const Profile = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    no_hp: "",
    alamat: "",
    password: "", // State for password
  });

  const [file, setFile] = useState(null); // State to hold the selected file
  const [error, setError] = useState("");
  const passwordRef = useRef();

  useEffect(() => {
    getUserData();
  }, []);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const getUserData = async () => {
    try {
      const data = await fetchUserData();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleSubmit = () => {
    if (!passwordRef.current.value) {
      setError("Password harus diisi");
      return;
    }
    const inputData = {
      username: userData.username,
      email: userData.email,
      no_hp: userData.no_hp,
      alamat: userData.alamat,
      password: passwordRef.current.value,
    };
    updateProfile(inputData, file)
      .then((response) => {
        console.log("Profile updated successfully:", response);
      })
      .catch((error) => {
        console.error("Failed to update profile:", error);
      });
  };

  if (!userData) {
    return;
  }

  return (
    <>
      <Navbar />
      <div className="app-container">
        <div className="content-wrap">
          <div className="profile-container">
            <h1>Profil Pengguna</h1>
            <div className="profile-details">
              <img
                src={`http://localhost:4000${userData.image}`}
                alt="Profile"
                className="profile-picture"
              />

              <div className="profile-info">
                <p>
                  <strong>Nama:</strong> {userData.username}
                </p>
                <p>
                  <strong>Email:</strong> {userData.email}
                </p>
                <p>
                  <strong>No Hp:</strong> {userData.no_hp}
                </p>
                <p>
                  <strong>Alamat:</strong> {userData.alamat}
                </p>
                <button className="edit-button" onClick={openModal}>
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Modal */}
            {modalOpen && (
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
                      <h5 className="modal-title">Edit Profil</h5>
                      <button
                        className="btn-close"
                        type="button"
                        onClick={closeModal}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <div className="row">
                        <div className={!file ? "col-12" : "col-lg-7"}>
                          {error && (
                            <div className="alert alert-danger">{error}</div>
                          )}

                          <form>
                            <label>
                              Nama:
                              <input
                                type="text"
                                name="username"
                                value={userData.username}
                                onChange={handleInputChange}
                                className="form-control"
                              />
                            </label>

                            <label>
                              Email:
                              <input
                                type="email"
                                name="email"
                                value={userData.email}
                                onChange={handleInputChange}
                                className="form-control"
                              />
                            </label>

                            <label>
                              No Hp:
                              <input
                                type="text"
                                name="no_hp"
                                value={userData.no_hp}
                                onChange={handleInputChange}
                                className="form-control"
                              />
                            </label>

                            <label>
                              Alamat:
                              <input
                                type="text"
                                name="alamat"
                                value={userData.alamat}
                                onChange={handleInputChange}
                                className="form-control"
                              />
                            </label>

                            <label>
                              Password:
                              <input
                                type="password"
                                name="password"
                                ref={passwordRef}
                                className="form-control"
                              />
                            </label>

                            <label>
                              Foto Profil:
                              <input
                                type="file"
                                onChange={handleFileChange}
                                className="form-control"
                              />
                            </label>

                            <button
                              type="button"
                              className="btn btn-edit-profile"
                              onClick={handleSubmit}
                            >
                              Simpan Perubahan
                            </button>
                          </form>
                        </div>

                        {file && (
                          <div className="col-lg-5 mt-3 mt-lg-0">
                            <img
                              src={URL.createObjectURL(file)}
                              alt="Preview"
                              className="profile-picture img-fluid"
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
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Profile;
