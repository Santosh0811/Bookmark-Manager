import React, { useContext, useEffect } from 'react';
import Card from './Card';
import BookmarkContext from './context/BookmarkContext';

const Bookmark = () => {
  const { fetchBookmark, clearOtpTimer, checkLogin, isLogin, navigate } = useContext(BookmarkContext);

  useEffect(() => {
    fetchBookmark();
    clearOtpTimer();
    checkLogin();
  }, []);

  useEffect(() => {

    if (isLogin) {
      navigate("/bookmark");
    } else {
      navigate("/");
    }

  }, [isLogin]);

  return (
    <div className='container'>
      <div className='d-flex justify-content-around align-items-center'>
        <h3 className='text-center fw-bolder text-white-50'><i className="fa-solid fa-thumbtack"></i> Bookmarks</h3>
      </div>
      <Card />
    </div>
  )
}

export default Bookmark

