//I need these imports to ba able to render out the React component
import React, { Component } from 'react';

//Custom Component imports
import Album from './Album';

// I make use of axios to make calls to Spotify's API.
import axios from 'axios';


class Artist extends Component {
    constructor(props) {
        super(props);

        // Setting the state for this component
        this.state = {
            token: (props.token) ? props.token : "",
            artist_id: (props.id) ? props.id : "",
            albums: [],
            album_info: {},
            artist: ""
        }
        // This binding is necessary to make `this` work in the callbacks for functions below
        this.fetchAlbums = this.fetchAlbums.bind(this);
        this.showAlbums = this.showAlbums.bind(this);
        
    }

    /* ---------- Custom Functions -----------*/
    /*  This functions makes a call to the Spotify API to return a list of albums based on the
        artist id (supplied via props from the App.js - line 147) */
    fetchAlbums() {
        let _self = this;
        axios({
            method: 'get',
            url: `https://api.spotify.com/v1/artists/${this.props.id}/albums`,
            headers: {
                'Authorization': 'Bearer ' + this.state.token
            },
            params: {
                album_type: 'album',
                limit: 10
            }
        })
        .then(function (response) {
            //On success, retrieve the albums and put them in an Array onto this React component's state object
            let tempArr = [];
            response.data.items.forEach((item) => {
                tempArr.push(item)
            })
            if (tempArr.length > 0) {
                _self.setState({ albums: tempArr });
            }
            
        });
    }
    /*  This function generates the markup to display the list of Albums from the album array
        stored in the component state. 
        I am using bootstrap 4 column cards, which have a masonry effect of displaying the cards */
    showAlbums() {
        if (this.state.albums.length > 0) {
            return this.state.albums.map((album) => <Album key={album.id} details={album} artist={this.state.artist} artist_id={this.state.artist_id} token={this.state.token}/>);            
        }
    }

    /* ------------ React Lifecycle Methods -------------*/
    componentDidMount() {
        //Once the component mounted, add the artist name to local state.
        this.setState({ artist: this.props.artist_name });
        //Call the 'fetchAlbums' function, to retrieve the albums and store in local state
        this.fetchAlbums()
    }
    componentDidUpdate() {
        /* Once the component is updated, check if something significant has changed, that merits making another
        call to the Spotify API */
        if (this.state.artist !== this.props.artist_name) {
            //Add the artist name to local state.
            this.setState({ artist: this.props.artist_name });
            //Call the 'fetchAlbums' function, to retrieve the albums and store in local state
            this.fetchAlbums()
        }

    }
    // Renders out the component markup
    render() {
        return (
            <div className="row">
                {/* Only show the below markup if the props have been passed correctly */}
                {(this.props.artist_id !== "") &&
                    <div className="col-sm-10 offset-sm-1">
                        <h1 className="display-4">{this.props.artist_name}</h1>
                        <hr />
                        {/* Only call 'showAlbums' if the albums in the local state is populated.
                            Otherwise diaply a message to the user. */} 
                        {(this.state.albums.length > 0) ? (
                        <div className="card-columns">
                            {this.showAlbums()}
                        </div>
                        ) : (
                            <p>We couldn't find any albums. Please try again...</p>
                        )}
                    </div>
                }
            </div>


        )
    }
}

export default Artist;