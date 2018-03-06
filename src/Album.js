//I need these imports to ba able to render out the React component
import React, { Component } from 'react';
//I need these imports for routing purposes (hooks into the browser browsing history)
import { Link } from "react-router-dom";

class Album extends Component {
    // Nothing fancy here, so we only have a render method.
    // We could even turn this into a stateless function using ES6 format
    render() {
        const albumInfo = this.props.details;

        return (
            <div className="card">
                <Link to={`/album/${albumInfo.id}/${this.props.artist_id}/${this.props.token}`}><img className="card-img-top" src={albumInfo.images[1].url} alt={albumInfo.name} /></Link>
                <div className="card-body">
                    <h5 className="card-title"><Link to={`/album/${albumInfo.id}/${this.props.artist_id}/${this.props.token}`}>{albumInfo.name}</Link></h5>
                    <p className="card-text">Artist: {this.props.artist}</p>
                </div>
            </div>
        )
    }
}

export default Album;