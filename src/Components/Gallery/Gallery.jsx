import React, { useReducer, useEffect } from "react";
import ImageCard from "../ImageCard/ImageCard";
import "./Gallery.css";

const initialState = {
  images: [],
  page: 1,
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "START":
      return { ...state, loading: true, error: null };
    case "SUCCESS":
      return {
        ...state,
        images: [...state.images, ...action.payload],
        loading: false,
      };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "INCREMENT_PAGE":
      return { ...state, page: state.page + 1 };
    default:
      return state;
  }
}

export default function Gallery() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { images, page, loading, error } = state;

  const accessKey = "xq00OU2z9E1BJeXKhC-TRycXYaPmYWWKqpqlgsjL1js";

  const fetchImages = async () => {
    dispatch({ type: "START" });
    try {
      const response = await fetch(
        `https://api.unsplash.com/photos?page=${page}&per_page=10`,
        {
          headers: {
            Authorization: `Client-ID ${accessKey}`,
          },
        }
      );
      const data = await response.json();
      // console.log("Fetched images:", data);
      dispatch({ type: "SUCCESS", payload: data });
    } catch (err) {
      dispatch({ type: "FETCH_ERROR", payload: err.message });
      // console.error("Error fetching images:", err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [page]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 100 >=
      document.documentElement.offsetHeight
    ) {
      dispatch({ type: "INCREMENT_PAGE" });
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="gallery-container">
      <h1>Infinite Scrolling Gallery</h1>
      {error && <p className="error">{error}</p>}
      <div className="image-grid">
        {images.map((img, index) => (
          <ImageCard key={img.id ? img.id : index} image={img} />
        ))}
      </div>
      {loading && <p className="loading-text">Loading more images...</p>}
    </div>
  );
}
