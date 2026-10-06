import React, { useState, useEffect, useRef } from 'react'
import BookmarkContext from './BookmarkContext'
import { toast } from 'react-toastify';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';

const BookmarkState = (props) => {
    const [loading, setLoading] = useState(false);
    const [isResendDisabled, setIsResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [userInfo, setUserInfo] = useState(null);
    const [isLogin, setIsLogin] = useState(false);
    const [bookmarkData, setBookmarkData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState("");
    const [form, setForm] = useState({ siteName: "", siteURL: "", siteLogo: "" });
    const [openModal, setOpenModal] = useState(false);
    const [id, setId] = useState(null);
    const [isUpdate, setIsUpdate] = useState(false);

    const intervalRef = useRef(null);
    const navigate = useNavigate();

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const fetchBookmark = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${BACKEND_URL}/api/siteBookmark/readBookmark`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            }
            );

            const data = await response.json();

            if (response.ok) {
                setBookmarkData(data.bookmarks);
            } else {
                toast.error(data.message);
                setBookmarkData([]);
            }

        } catch (error) {
            console.log("Failed to fetch Bookmark", error);
            toast.error("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    const filteredBookmarks = bookmarkData.filter((bookmark) => bookmark.siteName.toLowerCase().includes(searchTerm.toLowerCase()));

    const ascending = () => {
        const storedData = [...bookmarkData].sort((a, b) => {
            return a.siteName.localeCompare(b.siteName);
        })
        setBookmarkData(storedData);
    };

    const descending = () => {
        const bookmark = [...bookmarkData].sort((a, b) => {
            return b.siteName.localeCompare(a.siteName);
        });
        setBookmarkData(bookmark);
    }

    const handleSortChange = (e) => {
        const value = e.target.value;
        setSortOrder(value);
        if (value === "1") {
            ascending();
        }
        else if (value === "2") {
            descending();
        }
        else {
            fetchBookmark();
        }
    }

    const handleDelete = async ({ id, siteName }) => {
        const result = await Swal.fire({
            title: `Delete ${siteName} Bookmark?`,
            text: "You won't be able to recover it!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
        })

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${BACKEND_URL}/api/siteBookmark/deleteBookmark/${id}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include"
                })

                const data = await response.json();

                if (response.ok) {
                    await fetchBookmark();
                    toast.success(data.message);
                }
                else {
                    toast.error(data.message);
                }
            } catch (error) {
                console.log("Failed to delete Bookmark", error);
                toast.error("Something went wrong!");
            }
        }
    }

    const clearOtpTimer = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        setCountdown(0);
        setIsResendDisabled(false);
    };

    const handleResendOtp = async ({ email, method }) => {
        try {
            setLoading(true);

            const response = await fetch(`${BACKEND_URL}/api/userAuth/resendOtp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, method })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                clearOtpTimer();
                setIsResendDisabled(true);
                setCountdown(600);

                intervalRef.current = setInterval(() => {
                    setCountdown((prev) => {
                        if (prev <= 1) {
                            clearOtpTimer();
                            return 0;
                        }

                        return prev - 1;
                    });
                }, 1000);

            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error("Error While Re-Sending OTP");
            console.log(error);

        } finally {
            setLoading(false);
        }
    };

    const checkLogin = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/userAuth/checkLogin`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            })

            const data = await response.json();

            if (response.ok) {
                setUserInfo(data.userInfo);
                setIsLogin(true);
            }
            else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error);
        }
    }

    const handleUpdate = ({ siteName, siteURL, siteLogo, id }) => {
        setOpenModal(true);
        setIsUpdate(true);
        setForm({ siteName, siteURL, siteLogo })
        setId(id);
    }

    const updateSite = async () => {

        if (!id) {
            toast.error("Missing bookmark id");
            return;
        }

        if (!form.siteName || !form.siteURL) {
            toast.info("Please fill out all fields.");
            return;
        }

        const url = form.siteURL.startsWith("http") ? form.siteURL : `https://${form.siteURL}`;

        const logo = form.siteLogo === "" ? "https://website-app-assets.netlify.app/assets/bookmark-icon-p1MUAQiW.png" : form.siteLogo.startsWith("http") ? form.siteLogo : `https://${form.siteLogo}`;

        try {

            const response = await fetch(`${BACKEND_URL}/api/siteBookmark/updateBookmark/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ siteName: form.siteName, siteURL: url, siteLogo: logo })
            }
            );

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                setOpenModal(false);
                setIsUpdate(false);
                setId(null);
                setForm({ siteName: "", siteURL: "", siteLogo: "" });
                await fetchBookmark();
            } else {
                toast.error(data.message || "Update failed");
            }

        } catch (error) {
            console.log("Error while updating a Bookmark", error);
            toast.error("Something went wrong!");
        }
    };

    useEffect(() => {
        checkLogin();
    }, [])

    return (
        <BookmarkContext.Provider value={{
            toast, loading, BACKEND_URL, setLoading, clearOtpTimer, countdown, isResendDisabled, handleResendOtp, userInfo, setUserInfo, checkLogin, isLogin, searchTerm, setSearchTerm, sortOrder, handleSortChange, bookmarkData, setBookmarkData, fetchBookmark, filteredBookmarks, updateSite, handleUpdate, form, setForm, openModal, setOpenModal, isUpdate, setIsUpdate, setIsLogin, handleDelete, navigate
        }}>
            {props.children}
        </BookmarkContext.Provider>
    )
}

export default BookmarkState
