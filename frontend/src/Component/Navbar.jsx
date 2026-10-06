import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import BookmarkContext from './context/BookmarkContext';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { searchTerm, setSearchTerm, sortOrder, handleSortChange, bookmarkData, userInfo, isLogin, BACKEND_URL, setUserInfo, setIsLogin, setBookmarkData, navigate } = useContext(BookmarkContext);

  const [passChangeForm, setPassChangeForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const [toggleProfile, setToggleProfile] = useState(false);

  const location = useLocation();

  const hideNavbar = location.pathname.startsWith("/verifyEmail") || ["/login", "/signup", "/forgotPassword", "/verifyEmail"].includes(location.pathname);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPassChangeForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async () => {
    if (passChangeForm.newPassword !== passChangeForm.confirmPassword) {
      return toast.info("Password not matching");
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/siteBookmark/changePasswordInside`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: passChangeForm.currentPassword, newPassword: passChangeForm.newPassword }),
        credentials: "include"
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setPassChangeForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Something went Wrong in password change");
      toast.error("Something went Wrong");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/userAuth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      }
      );

      const data = await response.json();

      if (response.ok) {
        setUserInfo(null);
        setIsLogin(false);
        setBookmarkData([]);
        navigate("/");
        toast.success(data.message || "Logged out successfully");
      } else {
        toast.error(data.message || "Logout failed");
      }

    } catch (error) {
      console.log("Logout error:", error);
      toast.error("Something went wrong during logout");
    }
  };

  return (
    <>
      <nav className={`${hideNavbar ? "d-none" : ""} navbar navbar-expand-lg navbar-dark px-3 mb-3`} style={{ backgroundColor: "#00000096" }}>
        <div className="container-fluid">

          <Link className="navbar-brand fw-bold fs-4 cursor-pointer" to={isLogin ? "/bookmark" : "/home"}>
            🔖 BookMarks
          </Link>

          {/* ✅ ONLY FIX: added Bootstrap collapse attributes */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          {/* ✅ ONLY FIX: added matching ID */}
          <div className="collapse navbar-collapse gap-3 navbar-1" id="navbarNav">

            {isLogin ? (
              <>
                <div className='d-flex flex-row gap-3'>
                  <select
                    className="form-select"
                    style={{ width: "100px" }}
                    value={sortOrder}
                    onChange={handleSortChange}
                    disabled={bookmarkData.length === 0}
                  >
                    <option value="">Default</option>
                    <option value="1">Ascending Order</option>
                    <option value="2">Descending Order</option>
                  </select>

                  <form role="search">
                    <input
                      className="form-control"
                      type="search"
                      placeholder="Search sites"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      disabled={bookmarkData.length === 0}
                    />
                  </form>
                </div>

                <div className='d-flex align-items-center gap-3'>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="btn btn-primary rounded-4 border-0 text-black d-flex gap-1 align-items-center"
                    style={{backgroundColor: "#ffed4d8a"}}
                  >
                    Logout
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                  </button>

                  <i
                    className="fa-solid fa-user fs-4 cursor-pointer"
                    onClick={() => setToggleProfile(true)}
                    style={{ color: "white" }}
                  ></i>
                </div>
              </>
            ) : (
              <div className="d-flex flex-row gap-4">
                <i
                  className="fa-solid fa-right-to-bracket fs-4 cursor-pointer"
                  style={{
                    color: "white",
                    opacity: 1,
                    pointerEvents: "auto"
                  }}
                  onClick={() => navigate("/login")}
                ></i>

                <i
                  className="fa-solid fa-user-plus fs-4 cursor-pointer"
                  style={{
                    color: "white",
                    opacity: 1,
                    pointerEvents: "auto"
                  }}
                  onClick={() => navigate("/signup")}
                ></i>
              </div>
            )}

          </div>
        </div>
      </nav>

      {/* Profile Modal (unchanged) */}
      {
        toggleProfile &&
        <div className="modal d-block bg-dark bg-opacity-75" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 shadow-lg">
              <div className="modal-header bg-primary text-white rounded-top-4">
                <h5 className="modal-title">Account Details</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setToggleProfile(false)}
                ></button>
              </div>

              <div className="modal-body">
                <div className="row mb-3 align-items-center">
                  <label className="col-sm-4 col-form-label">Name</label>
                  <div className="col-sm-8">
                    <input type="text" className="form-control" value={userInfo?.userName} disabled />
                  </div>
                </div>

                <div className="row mb-3 align-items-center">
                  <label className="col-sm-4 col-form-label">Email</label>
                  <div className="col-sm-8">
                    <input type="text" className="form-control" value={userInfo?.email} disabled />
                  </div>
                </div>

                <div className="border-top pt-3">
                  <h6 className="fw-semibold mb-4">Change Password</h6>

                  <div className="row mb-3 align-items-center">
                    <label className="col-sm-4 col-form-label">Current Password</label>
                    <div className="col-sm-8">
                      <input
                        name='currentPassword'
                        type="password"
                        className="form-control"
                        value={passChangeForm.currentPassword}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="row mb-3 align-items-center">
                    <label className="col-sm-4 col-form-label">New Password</label>
                    <div className="col-sm-8">
                      <input
                        name="newPassword"
                        type="password"
                        className="form-control"
                        value={passChangeForm.newPassword}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="row mb-3 align-items-center">
                    <label className="col-sm-4 col-form-label">Confirm Password</label>
                    <div className="col-sm-8">
                      <input
                        name="confirmPassword"
                        type="password"
                        className="form-control"
                        value={passChangeForm.confirmPassword}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="modal-btn modal-btn-cancel" onClick={() => setToggleProfile(false)}>
                  Close
                </button>

                <button
                  className="modal-btn modal-btn-submit"
                  onClick={handleChangePassword}
                  disabled={
                    !passChangeForm.currentPassword ||
                    !passChangeForm.newPassword ||
                    !passChangeForm.confirmPassword ||
                    passChangeForm.newPassword !== passChangeForm.confirmPassword
                  }
                >
                  Save Changes
                </button>
              </div>

            </div>
          </div>
        </div>
      }
    </>
  );
};

export default Navbar;