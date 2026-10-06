import React, { useContext } from 'react'
import BookmarkContext from './context/BookmarkContext'
import { toast } from 'react-toastify';

const Addsite = () => {
    const { BACKEND_URL, fetchBookmark, updateSite, form, setForm, openModal, setOpenModal, isUpdate } = useContext(BookmarkContext);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const saveSite = async () => {
        if (!form.siteName || !form.siteURL) {
            toast.info("Please fill out all fields.");
            return;
        }

        const url = form.siteURL.startsWith("http") ? form.siteURL : `https://${form.siteURL}`;

        const logo = form.siteLogo === "" ? import.meta.env.VITE_BOOKMARK_LOGO : form.siteLogo.startsWith("http") ? form.siteLogo : `https://${form.siteLogo}`;

        try {
            const response = await fetch(`${BACKEND_URL}/api/siteBookmark/createBookmark`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ siteName: form.siteName, siteURL: url, siteLogo: logo })
            }
            );

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                setForm({ siteName: "", siteURL: "", siteLogo: "" });
                setOpenModal(false);
                fetchBookmark();
            } else {
                console.log("Failed to Save Bookmark");
                toast.error(data.message || "Something went wrong!");
            }
        } catch (error) {
            console.log("Failed to Save Bookmark ", error);
            toast.error("Something went wrong!");
        }
    };

    return (
        <div>
            {openModal && (
                <div className="modal d-block bg-dark bg-opacity-75" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div
                            className="modal-content rounded-4 shadow bg-black">
                            <div className="modal-header">
                                <h5 className="modal-title text-light">
                                    {isUpdate ? "Update" : "Add"} Site to Bookmarks
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close bg-light"
                                    onClick={() => {
                                        setOpenModal(false);
                                        setForm({ siteName: "", siteURL: "", siteLogo: "" });
                                    }}
                                />
                            </div>

                            {/* Form start */}
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (isUpdate) {
                                        updateSite();
                                    } else {
                                        saveSite();
                                    }
                                }}
                            >
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label text-light">
                                            Site Name:
                                        </label>
                                        <input
                                            name='siteName'
                                            type="text"
                                            className="form-control"
                                            value={form.siteName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label text-light">
                                            Site URL:
                                        </label>
                                        <input
                                            name='siteURL'
                                            type="text"
                                            className="form-control"
                                            value={form.siteURL}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label text-light">
                                            Site Logo URL (Optional):
                                        </label>
                                        <input
                                            name='siteLogo'
                                            type="text"
                                            className="form-control"
                                            value={form.siteLogo}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="modal-btn modal-btn-cancel"
                                        onClick={() => {
                                            setOpenModal(false);
                                            setForm({ siteName: "", siteURL: "", siteLogo: "" });
                                        }}
                                    >
                                        Cancel
                                    </button>

                                    <button type="submit" className="modal-btn modal-btn-submit" disabled={form.siteName.length <= 3 || form.siteURL.length <= 5 ||
                                        (form.siteLogo && form.siteLogo.length <= 5)}>
                                        {isUpdate ? "Update Site" : "Save Site"}
                                    </button>
                                </div>
                            </form>
                            {/* Form end */}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Addsite
