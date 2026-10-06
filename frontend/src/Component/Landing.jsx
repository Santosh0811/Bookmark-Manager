import React, { useContext, useEffect } from 'react';
import BookmarkContext from './context/BookmarkContext';
import { IoIosLock } from "react-icons/io";
import { FaFolderClosed, FaEarthAfrica } from "react-icons/fa6";

const Landing = () => {
    const { clearOtpTimer, isLogin, navigate } = useContext(BookmarkContext);

    useEffect(() => {
        clearOtpTimer();
    }, [])

    useEffect(() => {
        if (isLogin) {
            navigate("/bookmark");
        } else {
            navigate("/");
        }
    }, [isLogin]);

    return (
        <div className="bg-transparent">
            {/* Hero Section */}
            <section className="bg-gradient-left-right text-white py-1 text-center">
                <h1 className="display-5 fw-bold mb-3" style={{fontSize: "2rem"}}>
                    Save. Organize. Access Anywhere.
                </h1>

                <p className="lead text-light opacity-75 mb-5">
                    Store your favorite websites securely in the cloud and access them instantly from any device.
                </p>
                <div className="d-flex justify-content-center gap-4">
                    {
                        isLogin ?
                            <>
                                <button
                                    type="button"
                                    onClick={() => {
                                        navigate('/bookmark');
                                    }}
                                    className="btn btn-light btn-lg px-4 py-3 rounded-pill"
                                >
                                    Dashboard
                                </button>
                            </> :
                            <>
                                <button
                                    type="button"
                                    onClick={() => navigate('/login')}
                                    className="hero-btn-primary"
                                >
                                    Login
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate('/signup')}
                                    className="hero-btn-secondary"
                                >
                                    Sign Up
                                </button>
                            </>
                    }

                </div>

                <div className="d-flex justify-content-center gap-5 mt-5 flex-wrap">
                    <div>
                        <h3 className="fw-bold">100%</h3>
                        <small>Secure Storage</small>
                    </div>

                    <div>
                        <h3 className="fw-bold">24/7</h3>
                        <small>Availability</small>
                    </div>

                    <div>
                        <h3 className="fw-bold">∞</h3>
                        <small>Bookmarks</small>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-5 px-2 bg-gradient-left-right text-center">
                <div
                    className="card border-0 h-100 d-flex flex-lg-row flex-column gap-2 p-3"
                    style={{
                        background: "rgba(255,255,255,0.08)",
                        backdropFilter: "blur(10px)",
                        borderRadius: "20px",
                        color: "white"
                    }}
                >
                    <div className="col">
                        <div className="card border-0 h-100 feature-card bg-transparent">
                            <div className="card-body p-4 text-white">
                                <div className="fs-1 mb-3 text-info"><IoIosLock /></div>
                                <h5 className="fw-bold">Secure Storage</h5>
                                <p className="opacity-75">
                                    Your bookmarks are safely stored and protected.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col">
                        <div className="card border-0 h-100 feature-card bg-transparent">
                            <div className="card-body p-4 text-white">
                                <div className="fs-1 mb-3 text-warning"><FaFolderClosed /></div>
                                <h5 className="fw-bold">Smart Organization</h5>
                                <p className="opacity-75">
                                    Keep everything neatly organized and searchable.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col">
                        <div className="card border-0 h-100 feature-card bg-transparent">
                            <div className="card-body p-4 text-white">
                                <div className="fs-1 mb-3 text-primary"><FaEarthAfrica /></div>
                                <h5 className="fw-bold">Access Anywhere</h5>
                                <p className="opacity-75">
                                    Open your bookmarks on desktop, tablet, or mobile.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-5 text-center text-white">
                <h2 className="fw-bold mb-3">
                    Ready to organize your web?
                </h2>

                <p className="opacity-75 mb-4">
                    Join now and keep all your important links in one place.
                </p>

                <button
                    className="btn btn-light btn-lg rounded-pill px-5"
                    onClick={() => navigate("/signup")}
                >
                    Get Started Free
                </button>
            </section>
        </div>

    );
};

export default Landing;
