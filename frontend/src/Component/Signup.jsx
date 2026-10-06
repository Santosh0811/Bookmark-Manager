import React, { useContext, useEffect, useState } from 'react'
import BookmarkContext from './context/BookmarkContext';
import Loading from './Loading';

const Signup = () => {
    const { BACKEND_URL, toast, loading, setLoading, clearOtpTimer, countdown, isResendDisabled, handleResendOtp, isLogin, navigate } = useContext(BookmarkContext);

    const [signupForm, setSignupForm] = useState({ userName: "", email: "", password: "", confirmPassword: "", otp: "" });
    const [isTrue, setIsTrue] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setSignupForm((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSignUp = async () => {
        if (signupForm.password !== signupForm.confirmPassword) {
            return toast.error("Password is not matching");
        }

        try {
            setLoading(true);
            const response = await fetch(`${BACKEND_URL}/api/userAuth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(signupForm)
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                setIsTrue(true);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Error While SignUp");
            console.log(error);
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
                body: JSON.stringify({ email: signupForm.email, otp: signupForm.otp, method: "Signup" })
            })

            const data = await response.json();

            if (response.ok) {
                navigate("/login");
                toast.success(data.message || "Account Created Successfully");
                setIsTrue(false);
                setSignupForm({ userName: "", email: "", password: "", confirmPassword: "", otp: "" });
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

    useEffect(() => {
        if (!isLogin) {
            navigate("/signup");
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
                            <h5 className="modal-title text-light">Create Account to Bookmark</h5>
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
                                    handleVerifyOtp();
                                }
                                else {
                                    handleSignUp();
                                }
                            }}>

                            <div className="mb-1 p-2">
                                <label className="form-label text-white">Name:</label>
                                <input
                                    name='userName'
                                    type="name"
                                    value={signupForm.userName}
                                    onChange={handleChange}
                                    className="form-control"
                                    disabled={isTrue}
                                    required
                                />
                            </div>
                            <div className="mb-1 p-2">
                                <label className="form-label text-white">Email address:</label>
                                <input
                                    name='email'
                                    type="email"
                                    value={signupForm.email}
                                    onChange={handleChange}
                                    className="form-control"
                                    disabled={isTrue}
                                    required
                                />
                            </div>
                            <div className="mb-1 p-2">
                                <label className="form-label text-white">Password:</label>
                                <input
                                    name='password'
                                    type="password"
                                    value={signupForm.password}
                                    onChange={handleChange}
                                    className="form-control"
                                    disabled={isTrue}
                                    required
                                />
                            </div>
                            <div className="mb-1 p-2">
                                <label className="form-label text-white">Confirm Password:</label>
                                <input
                                    name='confirmPassword'
                                    type="password"
                                    value={signupForm.confirmPassword}
                                    onChange={handleChange}
                                    className="form-control"
                                    disabled={isTrue}
                                    required
                                />
                                {signupForm.confirmPassword > 0 && signupForm.password !== signupForm.confirmPassword && <label className="form-label text-white">Password is not matching</label>}
                            </div>

                            {
                                isTrue &&
                                <div className="mb-1 p-2">
                                    <div className='d-flex justify-content-between mb-2'>
                                        <label className="form-label text-white">Enter OTP Here:</label>

                                        <button
                                            className="btn btn-outline-secondary text-light p-1 border-0"
                                            type="button"
                                            onClick={() => handleResendOtp({ email: signupForm.email, method: "Bookmark-Resend Otp" })}
                                            disabled={isResendDisabled}
                                        >
                                            {isResendDisabled ? `Wait ${Math.floor(countdown / 60)}:${countdown % 60 < 10 ? '0' : ''}${countdown % 60}` : "Re-Send OTP"}
                                        </button>
                                    </div>
                                    <input
                                        name='otp'
                                        type="text"
                                        value={signupForm.otp}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    />
                                </div>
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
                                            disabled={signupForm.userName.length < 3 || signupForm.email.length < 5 || (isTrue && signupForm.otp.length < 6)}
                                        >
                                            {
                                                isTrue ? "Sign Up" : "Submit"
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form >
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Signup
