import React, { useContext, useEffect, useState } from 'react';
import BookmarkContext from './context/BookmarkContext';
import { useParams } from 'react-router-dom';
import Loading from './Loading';

const VerifyEmail = () => {
  const { toast, BACKEND_URL, setLoading, loading, clearOtpTimer, countdown, isResendDisabled, handleResendOtp, isLogin, navigate } = useContext(BookmarkContext);

  const { email } = useParams();

  const [otp, setOtp] = useState("");

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/userAuth/verifyOtp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, method: "VerifyEmail" })
      })

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        navigate("/login");
      }
      else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error While Verifying OTP");
      setLoading(false);
    } finally {
      clearOtpTimer();
      setLoading(false);
    }
  }

  useEffect(() => {
    if (email.length === 0) {
      navigate("/login");
    }
  })

  useEffect(() => {
    if (isLogin) {
      navigate("/bookmark");
    }

  }, [isLogin]);

  useEffect(() => {
    if (!email) return;

    handleResendOtp({ email, method: "Bookmark-Verify Email" });

    return () => {
      clearOtpTimer();
    };

  }, []);

  return (
    <div>
      {
        loading && <Loading />
      }
      <div className="d-flex justify-content-center align-items-center vh-100 bg-gradient" style={{
        background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
        color: '#fff'
      }}>
        <div className="text-center p-2 rounded shadow" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', maxWidth: 500 }}>
          <div className="mb-2">
            <i className="bi bi-patch-check-fill" style={{ fontSize: '2rem', color: '#4df59e' }}></i>
          </div>
          <h2 className="mb-3">Verify Your Email</h2>
          <p className="lead">
            Please check your inbox or spam folder.
          </p>

          <div className="mb-1 p-2">
            <label className="form-label text-white">Enter OTP Here:</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className='d-flex justify-content-around mt-2'>
            <button className="btn btn-outline-light p-2" type="button" onClick={handleVerifyOtp} disabled={otp.length < 6}>
              Verify OTP
            </button>

            <button
              className="btn btn-outline-light p-2"
              type="button"
              onClick={() => handleResendOtp({ email, method: "Bookmark-Verify Email" })}
              disabled={isResendDisabled}
            >
              {isResendDisabled ? `Wait ${Math.floor(countdown / 60)}:${countdown % 60 < 10 ? '0' : ''}${countdown % 60}` : "Re-Send OTP"}
            </button>

            <button className="btn btn-outline-light p-2"
              type="button"
              onClick={() => {
                navigate("/login");
              }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

  );
};

export default VerifyEmail;
