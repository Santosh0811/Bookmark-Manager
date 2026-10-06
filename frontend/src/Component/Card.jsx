import React, { useContext } from 'react';
import BookmarkContext from './context/BookmarkContext';
import Loading from './Loading';
import AddSite from './Addsite';

const Card = () => {
  const { handleDelete, filteredBookmarks, loading, handleUpdate, setOpenModal, setIsUpdate, setForm } = useContext(BookmarkContext);

  return (
    <>
      {
        loading && <Loading />
      }

      <div className='row'>
        <div
          className='col-md-3 col-6 my-3 bookmark-1 card-5 cursor-pointer'
          onClick={() => {
            setOpenModal(true);
            setIsUpdate(false);
            setForm({ siteName: "", siteURL: "", siteLogo: "" });
          }}
        >
          <div className="card mb-4 shadow-lg border-2 rounded-4 custom-card bg-light h-100">
            <div className="d-flex align-items-center justify-content-center h-100 w-100">
              <i className="fa-solid fa-plus position-absolute text-muted opacity-50" style={{ fontSize: "100px" }}></i>
            </div>
          </div>
        </div>

        {filteredBookmarks.length === 0 && (
          <div className='d-flex justify-content-center fw-bolder' style={{ height: "25vh" }}>
            <b className='d-flex align-items-center fs-4'>No Bookmark Found</b>
          </div>
        )}

        {/* Mapped cards */}
        {filteredBookmarks?.map((item) => (
          <div className='col-md-3 col-6 my-3 bookmark-1' key={item._id}>
            <div className="card mb-4 shadow-lg border-2 rounded-4 custom-card">
              <div className="d-flex align-items-center position-relative p-3">

                <div className='d-flex justify-content-between w-100 card-2'>
                  <div className="logo-container me-3 card-3 bg-transparent">
                    <img
                      src={item.siteLogo}
                      className="img-fluid rounded logo-img"
                      alt={item.siteName}
                    />
                  </div>

                  <div className="flex-grow-1 mt-2 text-center">
                    <h5 className="mb-2 fw-semibold">{item.siteName}</h5>
                    <a
                      className="btn btn-outline-primary btn-sm w-100"
                      href={item.siteURL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Site
                    </a>
                  </div>
                </div>

                <div className="icon-actions position-absolute top-0 end-0 p-2 d-flex gap-3">
                  <i
                    className="fa-solid fa-file-pen text-primary cursor-pointer"
                    onClick={() => handleUpdate({
                      siteName: item.siteName,
                      siteURL: item.siteURL,
                      siteLogo: item.siteLogo,
                      id: item._id
                    })}
                  />
                  <i
                    className="fa-solid fa-trash-can text-danger cursor-pointer"
                    onClick={() => handleDelete({
                      id: item._id,
                      siteName: item.siteName
                    })}
                  />
                </div>

              </div>
            </div>
          </div>
        ))}

      </div>
      <AddSite />
    </>
  );
};

export default Card;
