import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi';
import { useLike } from '../hook/useLike';
import { useAuthContext } from '../context/AuthContext';
import Lottie from 'react-lottie';
import animationData from '../lotties/heart-fav.json';
import { getImageName } from '../utils/imageUtils';

export default function PhotoCard({ photo, photos }) {
  const { user } = useAuthContext();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);
  const [like, setLike] = useState(() => {
    return localStorage.getItem(`photo-${photo.image_id}`) || photo.favorite_yn;
  });
  const [deleted] = useState(() => {
    return (
      localStorage.getItem(`photo-deleted-${photo.image_id}`) ||
      photo.deleted_yn
    );
  });
  const imageName = getImageName(photo.image_url);
  const updateKey = `photo-${photo.image_id}`;
  const updateDeleteKey = `photo-deleted-${photo.image_id}`;
  const { mutate } = useLike(updateKey);
  const navigate = useNavigate();

  // 하트 애니메이션
  const defaultOptions = {
    loop: false,
    autoplay: false,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  useEffect(() => {
    localStorage.setItem(updateKey, like);
  }, [like, updateKey]);
  useEffect(() => {
    localStorage.setItem(updateDeleteKey, deleted);
  }, [deleted, updateDeleteKey]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  const handleNavigate = () =>
    navigate(`/allPhoto/${photo.category_name}/${imageName}`, {
      state: { photo, photos },
    });
  const handleLikeClick = (e) => {
    e.stopPropagation(); // img 클릭으로 넘어가는 현상 방지
    const newLike = like === 'y' ? 'n' : 'y';
    setLike(newLike);
    mutate({ uid: user?.uid, id: photo.image_id });

    if (newLike === 'y' && !isAnimated) {
      setIsAnimated(true);
      setTimeout(() => {
        setIsAnimated(false);
      }, 1000);
    }
  };

  return (
    <div
      className="relative w-full p-3"
      onClick={handleNavigate}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        className={`${
          imageLoaded ? '' : 'hidden'
        } h-full w-full cursor-pointer object-cover transition-all ${
          hovered ? 'scale-95' : 'scale-100'
        } hover:ease-out`}
        src={photo.image_url}
        alt={photo.image_id}
        onLoad={handleImageLoad}
      />
      {like === 'y' ? (
        <HiHeart
          className="absolute top-7 right-7 text-4xl text-red-400 hover:cursor-pointer"
          onClick={handleLikeClick}
        />
      ) : (
        <HiOutlineHeart
          className="absolute top-7 right-7 text-4xl text-red-400 hover:cursor-pointer"
          onClick={handleLikeClick}
        />
      )}
      {isAnimated && (
        <div className="absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2">
          <Lottie options={defaultOptions} height={400} width={400} />
        </div>
      )}
      {!imageLoaded && (
        <div className="flex justify-center items-center w-full h-72">
          <svg
            className="animate-spin w-20 h-20 text-gray-500"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M 16 3 C 14.34375 3 13 4.34375 13 6 C 13 7.65625 14.34375 9 16 9 C 17.65625 9 19 7.65625 19 6 C 19 4.34375 17.65625 3 16 3 Z M 8.9375 6.4375 C 7.558594 6.4375 6.4375 7.558594 6.4375 8.9375 C 6.4375 10.316406 7.558594 11.4375 8.9375 11.4375 C 10.316406 11.4375 11.4375 10.316406 11.4375 8.9375 C 11.4375 7.558594 10.316406 6.4375 8.9375 6.4375 Z M 23.0625 7.9375 C 22.511719 7.9375 22.0625 8.386719 22.0625 8.9375 C 22.0625 9.488281 22.511719 9.9375 23.0625 9.9375 C 23.613281 9.9375 24.0625 9.488281 24.0625 8.9375 C 24.0625 8.386719 23.613281 7.9375 23.0625 7.9375 Z M 6 13.75 C 4.757813 13.75 3.75 14.757813 3.75 16 C 3.75 17.242188 4.757813 18.25 6 18.25 C 7.242188 18.25 8.25 17.242188 8.25 16 C 8.25 14.757813 7.242188 13.75 6 13.75 Z M 26 14.75 C 25.308594 14.75 24.75 15.308594 24.75 16 C 24.75 16.691406 25.308594 17.25 26 17.25 C 26.691406 17.25 27.25 16.691406 27.25 16 C 27.25 15.308594 26.691406 14.75 26 14.75 Z M 8.9375 21.0625 C 7.832031 21.0625 6.9375 21.957031 6.9375 23.0625 C 6.9375 24.167969 7.832031 25.0625 8.9375 25.0625 C 10.042969 25.0625 10.9375 24.167969 10.9375 23.0625 C 10.9375 21.957031 10.042969 21.0625 8.9375 21.0625 Z M 23.0625 21.5625 C 22.234375 21.5625 21.5625 22.234375 21.5625 23.0625 C 21.5625 23.890625 22.234375 24.5625 23.0625 24.5625 C 23.890625 24.5625 24.5625 23.890625 24.5625 23.0625 C 24.5625 22.234375 23.890625 21.5625 23.0625 21.5625 Z M 16 24.25 C 15.035156 24.25 14.25 25.035156 14.25 26 C 14.25 26.964844 15.035156 27.75 16 27.75 C 16.964844 27.75 17.75 26.964844 17.75 26 C 17.75 25.035156 16.964844 24.25 16 24.25 Z" />
          </svg>
        </div>
      )}
    </div>
  );
}
