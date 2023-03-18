import React, { useEffect } from "react";
import Auth from "./components/Auth";
import { db, auth, storage } from "./config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

function App() {
  const [movieList, setMovieList] = React.useState([]);
  const [newMovieTitle, setNewMovieTitle] = React.useState("");
  const [newReleaseDate, setNewReleaseDate] = React.useState(0);
  const [isNewMovieOscar, setIsNewMovieOscar] = React.useState(false);
  const [updatedTitle, setUpdatedTitle] = React.useState("");
  const [fileUpload, setFileUpload] = React.useState(null);

  const moviesCollectionRef = collection(db, "movies");

  const onSubmitMovie = async () => {
    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        receivedAnOscar: isNewMovieOscar,
        userId: auth?.currentUser?.uid,
      });
      getMovieList();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await deleteDoc(movieDoc);
    getMovieList();
  };

  const updateMovieTitle = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await updateDoc(movieDoc, { title: updatedTitle });
    getMovieList();
  };

  const uploadFile = async () => {
    if (!uploadFile) return;
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try {
      await uploadBytes(filesFolderRef, fileUpload);
    } catch (err) {
      console.error(err);
    }
  };

  const getMovieList = async () => {
    try {
      const data = await getDocs(moviesCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMovieList(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMovieList();
  }, []);

  return (
    <div className="layout">
      <Auth />
      <div className="movie-list-container">
        <div className="movie-list">
          <h1 className="form-title">Movie List</h1>
          <input
            type="text"
            placeholder="Movie title..."
            onChange={(e) => setNewMovieTitle(e.target.value)}
          />
          <input
            type="number"
            placeholder="Release year..."
            onChange={(e) => setNewReleaseDate(Number(e.target.value))}
          />
          <div className="movie-checkbox-container">
            <input
              className="movie-checkbox"
              type="checkbox"
              checked={isNewMovieOscar}
              onChange={(e) => setIsNewMovieOscar(e.target.checked)}
            />
            <label className="oscar-label">Received an Oscar</label>
          </div>
          <button className="btn movie-btn" type="text" onClick={onSubmitMovie}>
            Submit Movie
          </button>
        </div>
        <div className="movie-list">
          <h1 className="form-title">Movie List Output</h1>
          {movieList.map((movie) => (
            <div className="movie-output" key={movie.id}>
              <h1
                className="movie-title"
                style={{ color: movie.receivedAnOscar ? "green" : "red" }}>
                {movie.title}
              </h1>
              <p>Year released: {movie.releaseDate}</p>
              <button
                className="btn movie-btn"
                type="text"
                onClick={() => deleteMovie(movie.id)}>
                Delete Movie
              </button>
              <input
                type="text"
                placeholder="Edit Movie title..."
                onChange={(e) => setUpdatedTitle(e.target.value)}
              />
              <button
                className="btn movie-update-btn"
                type="text"
                onClick={() => updateMovieTitle(movie.id)}>
                Update movie title
              </button>
            </div>
          ))}
        </div>
        <div className="image-upload">
          <input
            className="file-upload"
            type="file"
            onChange={(e) => setFileUpload(e.target.files[0])}
          />
          <button className="btn" type="text" onClick={uploadFile}>
            Upload File
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
