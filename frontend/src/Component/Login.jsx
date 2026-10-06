import React, { useContext, useEffect, useState } from 'react'
import BookmarkContext from './context/BookmarkContext';
import Loading from './Loading';

const Login = () => {
    const { BACKEND_URL, toast, setLoading, loading, clearOtpTimer, countdown, isResendDisabled, handleResendOtp, isLogin, setIsLogin, navigate } = useContext(BookmarkContext);

    const [loginForm, setLoginForm] = useState({ email: "", password: "", otp: "" });
    const [isTrue, setIsTrue] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setLoginForm((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleLogin = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${BACKEND_URL}/api/userAuth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginForm)
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                setIsTrue(true);
            } else {
                toast.error(data.message);
                if (data.verified === false) {
                    navigate(`/verifyEmail/${loginForm.email}`);
                }
            }
        } catch (error) {
            toast.error("Error While Login");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${BACKEND_URL}/api/userAuth/verifyOtp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: loginForm.email, otp: loginForm.otp, method: "Login" }),
                credentials: "include"
            })

            const data = await response.json();

            if (response.ok) {
                setLoginForm({ email: "", password: "", otp: "" });
                setIsTrue(false);
                navigate("/bookmark");
                setIsLogin(true);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error("Error While Verifying OTP");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (isLogin) {
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
                            <h5 className="modal-title text-light">Login to Bookmark</h5>
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
                                if (isTrue) {
                                    handleVerifyOtp(e);
                                }
                                else {
                                    handleLogin(e);
                                }
                            }
                            }>
                            <div className="mb-1 p-2">
                                <label className="form-label text-white">Email address:</label>
                                <input
                                    name='email'
                                    type="email"
                                    value={loginForm.email}
                                    onChange={handleChange}
                                    className="form-control"
                                    disabled={isTrue}
                                    required
                                />
                            </div>
                            <div className="mb-1 p-2">
                                <div className='d-flex justify-content-between mb-2'>
                                    <label className="form-label text-white">Password:</label>

                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary text-light p-1 border-0"
                                        onClick={() => {
                                            navigate("/forgotPassword");
                                        }}
                                    >
                                        Forgot Password
                                    </button>
                                </div>

                                <input
                                    name='password'
                                    type="password"
                                    value={loginForm.password}
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
                                            onClick={() => handleResendOtp({ email: loginForm.email, method: "Bookmark-Resend Otp" })}
                                            disabled={isResendDisabled}
                                        >
                                            {isResendDisabled ? `Wait ${Math.floor(countdown / 60)}:${countdown % 60 < 10 ? '0' : ''}${countdown % 60}` : "Re-Send OTP"}
                                        </button>
                                    </div>
                                    <input
                                        name='otp'
                                        type="text"
                                        value={loginForm.otp}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    />
                                </div>
                            }

                            <div className="modal-footer d-flex justify-content-between">
                                <div className='d-flex gap-2'>
                                    <button
                                        type="button"
                                        className="modal-btn modal-btn-signup"
                                        onClick={() => navigate("/signup")}
                                        data-bs-dismiss="modal"
                                    >
                                        Sign Up
                                    </button>
                                </div>

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
                                            loginForm.email.length < 5 ||
                                            loginForm.password.length < 6 ||
                                            (isTrue && loginForm.otp.length < 6)
                                        }
                                    >
                                        {isTrue ? "Login" : "Submit"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Login
