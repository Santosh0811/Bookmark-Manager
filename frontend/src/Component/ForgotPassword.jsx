import React, { useContext, useEffect, useState } from 'react'
import BookmarkContext from './context/BookmarkContext'
import Loading from './Loading';

const ForgotPassword = () => {
    const { BACKEND_URL, toast, loading, setLoading, clearOtpTimer, countdown, isResendDisabled, handleResendOtp, isLogin, navigate } = useContext(BookmarkContext);

    const [forgotPassForm, setForgotPassForm] = useState({ email: "", otp: "", newPassword: "", confirmPassword: "" });
    const [isTrue, setIsTrue] = useState(false);
    const [isOtpTrue, setIsOtpTrue] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForgotPassForm((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleForgotPassword = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${BACKEND_URL}/api/userAuth/forgotpassword`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: forgotPassForm.email })
            })

            const data = await response.json();

            if (response.ok) {
                setIsTrue(true);
                toast.success(data.message);
            }
            else {
                toast.error(data.message);
                if (data.verified === false) {
                    navigate(`/verifyEmail/${forgotPassForm.email}`);
                }
            }

        } catch (error) {
            console.log("Something went Wrong");
            toast.error("Something went Wrong");
        } finally {
            setLoading(false);
        }
    }

    const handleVerifyOtp = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${BACKEND_URL}/api/userAuth/verifyOtp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: forgotPassForm.email, otp: forgotPassForm.otp, method: "ForgotPassword" })
            })

            const data = await response.json();

            if (response.ok) {
                setIsOtpTrue(true);
                toast.success(data.message);
            }
            else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error("Error While Verifying OTP");
        } finally {
            setLoading(false);
        }
    }

    const handleChangePassword = async () => {
        if (forgotPassForm.newPassword !== forgotPassForm.confirmPassword) {
            return toast.error("Password is not matching");
        }

        try {
            setLoading(true);
            const response = await fetch(`${BACKEND_URL}/api/userAuth/changePasswordOutside`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: forgotPassForm.email, newPassword: forgotPassForm.newPassword })
            })

            const data = await response.json();

            if (response.ok) {
                setForgotPassForm({ email: "", otp: "", newPassword: "", confirmPassword: "" });
                toast.success(data.message);
                navigate("/login");
                setIsTrue(false);
                setIsOtpTrue(false);
            }
            else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Something went Wrong");
            toast.error("Something went Wrong");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!isLogin) {
            navigate("/forgotPassword");
        } else {
            navigate("/bookmark");
        }

    }, [isLogin]);

    useEffect(() => {
        return () => {
            clearOtpTimer();
        };
    }, []);

    return (
        <div>
            {
                loading && <Loading />
            }

            <div className="modal d-block bg-dark bg-opacity-75" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content rounded-4 shadow bg-transparent">
                        <div className="modal-header">
                            <h5 className="modal-title text-light">Forgot Password of Bookmark</h5>
                            <button
                                type="button"
                                className="btn-close bg-light"
                                onClick={() => {
                                    navigate("/home");
                                }}
                            />
                        </div>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (isOtpTrue) {
                                    handleChangePassword();
                                }
                                else if (isTrue) {
                                    handleVerifyOtp();
                                }
                                else {
                                    handleForgotPassword();
                                }
                            }}>


                            <div className="mb-1 p-2">
                                <label className="form-label text-white">Enter your email to reset password:</label>
                                <input
                                    name='email'
                                    type="email"
                                    value={forgotPassForm.email}
                                    onChange={handleChange}
                                    className="form-control"
                                    disabled={isTrue}
                                    required
                                />
                            </div>

                            {
                                isTrue &&
                                <div className="mb-1 p-2">
                                    <div className='d-flex justify-content-between mb-2'>
                                        <label className="form-label text-white">Enter OTP Here:</label>

                                        <button
                                            className="btn btn-outline-secondary text-light p-1 border-0"
                                            type="button"
                                            onClick={() => handleResendOtp({ email: forgotPassForm.email, method: "Bookmark-Resend Otp" })}
                                            disabled={isResendDisabled || isOtpTrue}
                                        >
                                            {isResendDisabled ? `Wait ${Math.floor(countdown / 60)}:${countdown % 60 < 10 ? '0' : ''}${countdown % 60}` : "Re-Send OTP"}
                                        </button>
                                    </div>

                                    <input
                                        name='otp'
                                        type="text"
                                        value={forgotPassForm.otp}
                                        onChange={handleChange}
                                        className="form-control"
                                        disabled={isOtpTrue}
                                        required
                                    />
                                </div>
                            }

                            {
                                isOtpTrue &&
                                <>
                                    <div className="mb-1 p-2">
                                        <label className="form-label text-white">New Password:</label>
                                        <input
                                            name='newPassword'
                                            type="password"
                                            value={forgotPassForm.newPassword}
                                            onChange={handleChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>


                                    <div className="mb-1 p-2">
                                        <label className="form-label text-white">Confirm Password:</label>
                                        <input
                                            name='confirmPassword'
                                            type="password"
                                            value={forgotPassForm.confirmPassword}
                                            onChange={handleChange}
                                            className="form-control"
                                            required
                                        />
                                        {
                                            forgotPassForm.newPassword !== forgotPassForm.confirmPassword && <div className="text-light">
                                                Password is not Matching
                                            </div>
                                        }
                                    </div>
                                </>
                            }

                            <div className="modal-footer d-flex justify-content-between">
                                <div className='d-flex justify-content-between w-100'>

                                    <button
                                        type="button"
                                        className="modal-btn modal-btn-signup"
                                        onClick={() => navigate("/login")}
                                        data-bs-dismiss="modal"
                                    >
                                        Login Page
                                    </button>

                                    <div className='d-flex gap-2'>
                                        <button
                                            type="button"
                                            className="modal-btn modal-btn-cancel"
                                            onClick={() => navigate("/home")}
                                            data-bs-dismiss="modal"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            className="modal-btn modal-btn-submit"
                                            disabled={
                                                forgotPassForm.email.length < 5 ||
                                                (isTrue && forgotPassForm.otp.length < 6)
                                            }
                                        >
                                            {
                                                isOtpTrue ? "Forgot Password" : isTrue ? "Verify OTP" : "Submit"
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
