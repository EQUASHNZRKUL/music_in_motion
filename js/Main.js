import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import axios from 'axios';

class Logo extends React.Component{
  render() {
    return (<h1 id="logo" className="logo">
    <i className="fa fa-music" aria-hidden="true"></i> 
      music n motion
       </h1>);
  }
}

function PlayButton () {
  return (
    <iframe className="spotify-btn" src="https://open.spotify.com/embed?uri=spotify:track:60a0Rd6pjrkxjPbaKzXjfq" width="80" height="80"/>
  )
}
function SearchEntry(props) {
  return (
    <li className="search-entry">
      <button className="search-btn">
        <img className="song-img" src={props.img} alt={props.title} />
        <div className="song-description">
          <h1 className="song-title">{props.title}</h1>
          <h2 className="song-album">{props.album}</h2>
          <p className="song-artist">{props.artist}</p>
        </div>
      </button>
    </li>
  )
}

class SearchEntryList extends React.Component {
  renderEntry(i) {
    return (
      <SearchEntry
        key={i}
        img={this.props.searchResults[i].img}
        title={this.props.searchResults[i].title}
        artist={this.props.searchResults[i].artist}
        album={this.props.searchResults[i].album}
      /> 
    );
  }

  render() {
    let entries = [];
    const results = this.props.searchResults;
    for (let i = 0; i < results.length; i++) {
      entries.push(this.renderEntry(i));
    }
    return (
      <ul className="search-entry-list">
        {entries}
      </ul>
    );
  }
}
class InputForm extends React.Component {
  render () {
    return (
      <form id="form" className="input-form" onSubmit={this.props.onSubmit}>
        <div className="input-wrapper">
          <input type="text" className="input" name="input" 
            onChange={this.props.onChange}
            placeholder="search for a song, see it in motion"
            autoComplete="off"/>
          <SearchEntryList searchResults={this.props.searchResults}/>
          <p className="placeholder">
            <i className="fa fa-search" aria-hidden="true"></i>
          </p>
        </div>
        <PlayButton/>
        {/* <button type="submit" form="form" className="input-btn" name="submit">
          <i className="fa fa-play" aria-hidden="true"></i>
        </button> */}
      </form>
    );
  }
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      inputValue: "", 
      searchResults: [],
      currSong: "",
      gifs: [],
      lyrics: [],
      timings: [],
      inputTimeout: null,
    };
  }

  search() {
    let data = { songTitle: this.state.inputValue }
    axios.post("/getSongs", data)
      .then(res => {
        let retrieved = res.data.searchResults;
        let newSearchResults = [];
        for (let entry of retrieved) {
          let curr = {
            img: entry.art,
            artist: entry.artist,
            title: entry.title,
            album: entry.album
          };
          newSearchResults.push(curr);
        }
        this.setState({searchResults : newSearchResults});
      });
  }

  handleInputChange(e) {
    const val =  e.target.value;
    if (this.state.inputTimeout) {
      this.setState((prevState, props) => {
        inputTimeout: clearTimeout(prevState.inputTimeout);
      });
      this.setState({
        searchResults: [],
      });
    }

    this.setState({
      inputTimeout: 
        setTimeout(() => {
          this.setState({
            inputValue : val,
          });
          if (val !== "")
            this.search(val);
        }, 1000)
    });
  }

  handleSubmit(e) {

  }

  render() {
    return (
      <div>
        <ReactCSSTransitionGroup
        transitionName="logo-anim" transitionAppear={true}
        transitionAppearTimeout={500}
        transitionEnter={false} 
        transitionLeave={false}>
          <Logo key="logo"/>
        </ReactCSSTransitionGroup>

        <ReactCSSTransitionGroup
        transitionName="input-anim" transitionAppear={true}
        transitionAppearTimeout={500}
        transitionEnter={false} 
        transitionLeave={false}>
          <InputForm 
            key="input"
            value={this.state.inputValue} 
            onSubmit={this.handleSubmit}
            onChange={this.handleInputChange}
            searchResults={this.state.searchResults}
          />
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

export default Main;

