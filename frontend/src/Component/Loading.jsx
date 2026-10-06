import React from 'react'

const Loading = () => {
    return (
        <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{
                zIndex: 9999,
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                background: "rgba(0,0,0,0.3)"
            }}
        >
            <div
                className="d-flex flex-column align-items-center p-4"
                style={{
                    background: "rgba(20,20,20,0.5)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "20px",
                    minWidth: "300px"
                }}
            >
                <div
                    className="spinner-border text-light mb-3"
                    style={{ width: "3rem", height: "3rem" }}
                />

                <span
                    className="text-light fw-semibold"
                    style={{ letterSpacing: "1px" }}
                >
                    Loading...
                </span>
            </div>
        </div>
    )
}

export default Loading