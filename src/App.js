//I need these imports to ba able to render out the React component
import React, { Component } from 'react';
//I need these imports for routing purposes (hooks into the browser browsing history)
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

//Custom Component imports
import Artist from './Artist';
import AlbumDetail from './AlbumDetail';

/*
  The CSS we need for this application
  - We use Bootstrap CSS 4 (the SCSS files) for this project
*/
import './App.css';

// I make use of axios to make calls to Spotify's API.
import axios from 'axios';

//Main React app class
class App extends Component {
  constructor(props) {
    super(props);
    // Setting the state for this component
    this.state = {
      token: "",
      artist: "",
      artistArr: [],
      artist_id: "",
      artist_name: ""
    }

    // This binding is necessary to make `this` work in the callbacks for functions below
    this.handleArtistChange = this.handleArtistChange.bind(this);
    this.displayArtists = this.displayArtists.bind(this);
    this.fetchArtists = this.fetchArtists.bind(this);
    this.showArtistById = this.showArtistById.bind(this);
    this.getSpotifyToken = this.getSpotifyToken.bind(this);
  }
  /* ---------- Custom Functions -----------*/
  /*  This function hooks to the search input field and updates the state as the user types.
      It also calls the 'fetchArtists' function as the user types to return a subset of artists
      from Spotify */
  handleArtistChange(event) {
    this.setState({ artist: event.target.value });
    // Only trigger the 'fetchArtists' function after typing the 2nd character
    if (event.target.value.length >= 2) {
      this.setState({ artist_id: "" });
      this.fetchArtists(event.target.value);
    }

  }
  /*  This functions makes a call to the Spotify API to return a list of artists based on the
      input parameter supplied to the function */
  fetchArtists(artist_txt) {
    let _self = this;
    axios({
      method: 'get',
      url: 'https://api.spotify.com/v1/search',
      headers: {
        'Authorization': 'Bearer ' + this.state.token /* Necessary to authenticate to Spotify */
      },
      params: {
        q: artist_txt,
        type: 'artist',
        limit: 10 /* For this demo I'm limiting results to 10. Remove to get ALL results */
      }
    })
    .then(function (response) {
      //On success, retrieve the artists and put them in an Array onto this React component's state object
      let tempArr = [];
      response.data.artists.items.forEach((item) => {
        tempArr.push(item)
      })
      if (tempArr.length > 0) {
        _self.setState({ artistArr: tempArr });
      }

    });
  }
  /*  This function generates the markup to display the list of Artists from the given artist array in the component state.
      This is mimicking the dropdown behaviour wanted. */
  displayArtists() {
    if (this.state.artistArr.length > 0) {
      return <div className="list-group">{this.state.artistArr.map((item) => <Link to={`/artist/${item.id}`} onClick={() => this.showArtistById(item.id, item.name)} key={item.id} className="list-group-item list-group-item-action">{item.name}</Link>)}</div>
    }
  }
  /*  This function is used in the function above. It just 'resets' the state object with the updated values given
      through the function parameters */
  showArtistById(artist_id, artist_name) {
    this.setState({
      artist: "",
      artist_id: artist_id,
      artistArr: [],
      artist_name: artist_name
    })
  }
  /*  Got this function from the spotify-web-api. It basically grabs the token from the Spotify auth url.
      Then I save the token into my local Component state object */
  getSpotifyToken() {
    let hashParams = {};
    let e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    // eslint-disable-next-line
    while (e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }

    if (!hashParams.access_token) {
      window.location.href = 'https://accounts.spotify.com/authorize?client_id=064fedd3e8544c328569613863cf4eba&scope=playlist-read-private%20playlist-read-collaborative%20playlist-modify-public%20user-read-recently-played%20playlist-modify-private%20ugc-image-upload%20user-follow-modify%20user-follow-read%20user-library-read%20user-library-modify%20user-read-private%20user-read-email%20user-top-read%20user-read-playback-state&response_type=token&redirect_uri=http://localhost:3000/callback/';
    } else {
      this.setState({ token: hashParams.access_token })
    }
  }
  /* ------------ React Lifecycle Methods -------------*/
  componentDidMount() {
    //Once the component mounted, call the function below to get the token.
    this.getSpotifyToken();
  }
  // Renders out the application
  render() {
    return (
      <Router>
        <div className="container">
          <div className="row">
            <div className="col-md-10 offset-md-1">
              <div className="jumbotron">
                <h1>React App using Spotify API</h1>
                <hr className="my-4" />
                <form className="searchSpotify">
                  <div className="form-group search-field">
                    <label htmlFor="inputArtist">Search for Artist</label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputArtist"
                      aria-describedby="emailHelp"
                      placeholder="Enter search query"
                      value={this.state.artist}
                      onChange={this.handleArtistChange} />
                  </div>
                  {this.displayArtists()}
                </form>
              </div>
            </div>
          </div>
          {/* Render below based on the url requested by the browser. */}
          <Route path="/artist/:id" render={() => <Artist id={this.state.artist_id} token={this.state.token} artist_name={this.state.artist_name} />} />
          <Route path="/album/:album_id/:artist_id/:token" component={AlbumDetail} />

        </div>
      </Router>
    );
  }
}


export default App;
