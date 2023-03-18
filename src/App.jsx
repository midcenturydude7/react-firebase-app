import React, { useEffect } from "react";
import Auth from "./components/Auth";
import { db } from "./config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

function App() {
  const [movieList, setMovieList] = React.useState([]);
  const [newMovieTitle, setNewMovieTitle] = React.useState("");
  const [newReleaseDate, setNewReleaseDate] = React.useState(0);
  const [isNewMovieOscar, setIsNewMovieOscar] = React.useState(false);

  const moviesCollectionRef = collection(db, "movies");

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

  const onSubmitMovie = async () => {
    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        receivedAnOscar: isNewMovieOscar,
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
          <button className="btn" type="text" onClick={onSubmitMovie}>
            Submit Movie
          </button>
        </div>
        <div className="movie-list">
          <h1 className="form-title">Movie List Output</h1>
          {movieList.map((movie) => (
            <div key={movie.id}>
              <h1 style={{ color: movie.receivedAnOscar ? "green" : "red" }}>
                {movie.title}
              </h1>
              <p>Year released: {movie.releaseDate}</p>
              <button className="btn" onClick={() => deleteMovie(movie.id)}>
                Delete Movie
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
