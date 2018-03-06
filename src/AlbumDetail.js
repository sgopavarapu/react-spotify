//I need these imports to ba able to render out the React component
import React, { Component } from 'react';
//I need these imports for routing purposes (hooks into the browser browsing history)
import axios from 'axios';

class AlbumDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            albumId: this.props.match.params.album_id,
            artistId: this.props.match.params.artist_id,
            token: this.props.match.params.token,
            albumDetails: {}
        }
        this.fetchAlbumsDetails = this.fetchAlbumsDetails.bind(this);
        this.listSongs = this.listSongs.bind(this);
        this.millisToMinutesAndSeconds = this.millisToMinutesAndSeconds.bind(this);
    }

    /* ---------- Custom Functions -----------*/
    // A utility function to convert milliseconds to 'min:sec' format
    millisToMinutesAndSeconds(duration_ms) {
        var minutes = Math.floor(duration_ms / 60000);
        var seconds = ((duration_ms % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    fetchAlbumsDetails() {
        let _self = this;
        axios({
            method: 'get',
            url: `https://api.spotify.com/v1/albums/${this.state.albumId}`,
            headers: {
                'Authorization': 'Bearer ' + this.state.token
            }
        })
            .then(function (response) {
                _self.setState({ albumDetails: response.data });
            });
    }
    listSongs(songArray) {
        return <ul className="list-group">{songArray.map((song) => <li key={song.id} className="list-group-item">{song.name}<span className="badge badge-secondary float-right">{this.millisToMinutesAndSeconds(song.duration_ms)}</span></li>)}</ul>;
    }

    /* ------------ React Lifecycle Methods -------------*/
    componentDidMount() {
        this.fetchAlbumsDetails();
    }
    render() {


        return (
            <div className="row">
                {(this.state.albumDetails.name) &&
                    <div className="col-sm-10 offset-sm-1">
                        <h1 className="display-4">{this.state.albumDetails.artists[0].name}</h1>
                        <hr />
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <img alt={this.state.albumDetails.name} src={this.state.albumDetails.images[1].url} className="img-thumbnail" />
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="table-responsive">
                                            <table className="table">
                                                <tbody>
                                                    <tr>
                                                        <td>Album Name:</td>
                                                        <td>{this.state.albumDetails.name}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Artist:</td>
                                                        <td>{this.state.albumDetails.artists[0].name}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Release Date:</td>
                                                        <td>{this.state.albumDetails.release_date}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col">
                                        <h4 className="card-text">List of Songs:</h4>
                                        <hr />
                                        {this.listSongs(this.state.albumDetails.tracks.items)}
                                    </div>
                                    <div className="col">
                                        <h4 className="card-text">Preview Album:</h4>
                                        <hr />
                                        <div className="embed-responsive embed-responsive-1by1">
                                            <iframe
                                                title={this.state.albumDetails.name}
                                                className="embed-responsive-item"
                                                src={`https://open.spotify.com/embed?uri=${this.state.albumDetails.uri}`}
                                                height="380"
                                                width="300"
                                                frameBorder="0"
                                                allowtransparency="true"
                                                allow="encrypted-media"
                                            ></iframe>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default AlbumDetail;