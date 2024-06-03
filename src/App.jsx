import React, { useState, useEffect } from 'react';
import './App.css';
import ReactLogo from './react.png';
import Star from './star.png';

function App() {
  const URL = 'https://images-api.nasa.gov/search?q=space&media_type=image';
  
  const [imageJson, setImageJson] = useState([]);
  const [random, setRandom] = useState(null); // State for storing the random number
  const [showDeepDive, setShowDeepDive] = useState(false); // State for toggling deep dive section
  const [favoritedPics, setFavoritedPics] = useState([]); // State for storing favorited photos
  const [favoriteClicked, setFavoriteClicked] = useState(false)

  useEffect(() => { // uses useEffect to fetch the API
    const fetchData = async () => {
      const result = await fetch(URL);
      result.json().then(json => {
        setImageJson(json.collection.items); // uses json to get an array of image objects with a bunch of attributes
        setRandom(getRandomImage(json.collection.items));
      });
    }
    fetchData();
  }, []);

  const getRandomImage = (items) => {
    return Math.floor(Math.random() * (items.length)); // gets a random index between all of the indices of the setImageJson array in order to get a random image
  }

  const renderImage = () => {
    if (imageJson.length > 0 && random !== null) {
      return <img className="spaceImage" src={imageJson[random].links[0].href} alt="Space" />; // takes the image that is created by random and gets its link
    } else {
      return <h1>SPACE PHOTO</h1>; // Or you can return a placeholder image or loading indicator
    }
  }

  const getNewPhoto = () => {
    const newRandom = getRandomImage(imageJson); // Generate a new random number
    setRandom(newRandom); // Update the state with the new random number
  }

  const favoritePhoto = () => {
    if (random !== null) {
      const newFavorite = imageJson[random].links[0].href;
      if (!favoritedPics.includes(newFavorite)) {
        setFavoritedPics([...favoritedPics, newFavorite]);
      }
    }
  }

  const deepDive = () => {
    if (imageJson.length > 0 && random !== null && showDeepDive) {
      return (
        <>
          <h1 className="desc">{imageJson[random].data[0].description}</h1>
          <div className="favorite-container" onClick={favoritePhoto}>
            <img className="star" src={Star} alt="Star" />
            <h1 className="favLabel">FAVORITE PHOTO</h1>
          </div>
        </>
      );
    } else {
      return null;
    }
  }

  const toggleDeepDive = () => {
    setShowDeepDive(!showDeepDive);
  }

  if (favoriteClicked) {
    if (favoritedPics.length > 0) {
      return (
        <>
          <button className="button-fav" onClick={() => setFavoriteClicked(false)}>BACK</button>
          <h1 className="fav-photo">Favorited Photos:</h1>
          {favoritedPics.map((pic, index) => (
            <img key={index} src={pic} alt={`Favorite ${index}`} className="favoritedImage" />
          ))}
        </>
      );
    } else {
      return (
        <>
          <button className="button-fav" onClick={() => setFavoriteClicked(false)}>BACK</button>
          <h1 className="fav-error">NO FAVORITED PICTURES</h1>
        </>
      );
    }
  } else {
    return (
      <>
        <button className="button-fav" onClick={() => setFavoriteClicked(true)}>SEE FAVORITES</button>
        <h1 className="header">Jump Into The World of NASA and The Beauty Of Space!</h1>
        <h1 className="sub-header">
          Programmed by Emilio Figueroa using
          <img src={ReactLogo} alt="REACT Logo" className="react-logo" />
        </h1>
        <div className="image-container">
          {renderImage()}
        </div>
        <button className="next-photo" onClick={getNewPhoto}>GET NEXT PHOTO</button>
        {showDeepDive && deepDive()}
        <button className="deep-dive" onClick={toggleDeepDive}>
          {showDeepDive ? 'HIDE DEEP DIVE' : 'TAKE A DEEP DIVE INTO THIS PHOTO'}
        </button>
      </>
    );
  }
}

export default App;
