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

function PlayButton (props) {
  if (props.currSongUri === "") {
    return "";
  } else {
    return (
      <iframe className="spotify-btn" src={
        ("https://open.spotify.com/embed?uri=" + props.currSongUri)} width="80" height="80" frameborder="0" allowtransparency="false">
      </iframe>
    );
  }
}

class GifPlayer extends React.Component {
  render() {
    if (this.props.currentGif !== "") {
      return(
        <div className="gif-player">
          <div className="gif-wrapper">
            <img src={this.props.currentGif} alt="gif"/>
          </div>
        </div>
      );
    } else {
      return "";
    }
  }
}

function SearchEntry(props) {
  return (
    <li className="search-entry">
      <button className="search-btn" onClick={(i) => props.onClick(i)}>
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
        uri={this.props.searchResults[i].uri}
        id={this.props.searchResults[i].id}
        onClick={() => this.props.onClick(i)}
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
    if (this.props.hideTopBtn) {
      return (
        <div id="form" className="input-form">
          <div className="input-wrapper">
            <input type="text" className="input" name="input" 
              onChange={this.props.onChange}
              placeholder="search for a song, see it in motion"
              autoComplete="off"
              value={this.props.inputValue}/>
              <SearchEntryList searchResults={this.props.searchResults} onClick={this.props.onClickSearchEntry} />
            <p className="placeholder">
              <i className="fa fa-search" aria-hidden="true"></i>
            </p>
          </div>
          <div className="input-btn-wrapper">
            <PlayButton currSongUri={this.props.currSongUri} />
          </div>
        </div>
      );
    } else {
      return (
        <div id="form" className="input-form">
          <div className="input-wrapper">
            <input type="text" className="input" name="input" 
              onChange={this.props.onChange}
              placeholder="search for a song, see it in motion"
              autoComplete="off"
              value={this.props.inputValue}/>
              <SearchEntryList searchResults={this.props.searchResults} onClick={this.props.onClickSearchEntry} />
            <p className="placeholder">
              <i className="fa fa-search" aria-hidden="true"></i>
            </p>
          </div>
          <div className="input-btn-wrapper">
            <button className="input-btn" name="submit" onClick=      
              {this.props.onPlay}>
            </button>
            <PlayButton currSongUri={this.props.currSongUri} />
          </div>
        </div>
      );
    }
  }
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
    this.handleClickSearchEntry = this.handleClickSearchEntry.bind(this);
    this.state = {
      inputValue: "", 
      searchResults: [],
      currSongUri: "",
      currSongId: null,
      gifs: [],
      inputTimeout: null,
      hideTopBtn: false,
      currGifUrl: "",
      gifIndex: -1,
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
            album: entry.album,
            uri: entry.uri,
            id: entry.id,
          };
          newSearchResults.push(curr);
        }
        this.setState({searchResults : newSearchResults});
      });
  }

  retrieveGifs() {
    let data = { songId : this.state.currSongId }
    axios.post('/getGifs', data)
      .then(res => {
        this.setState({
          gifs: res.data.gifs
        });
      });
  }

  getCurrentGif() {
    if (this.state.gifIndex > 0 &
        & this.state.gifIndex < this.state.gifs.length) {
      let i = this.state.gifIndex;
      let currGif = this.state.gifs[i].url;
      console.log(currGif);
      let currTime = this.state.gifs[i].duration;
      console.log(currTime);
      this.setState({currGifUrl : currGif});
      setTimeout(() => {
        this.setState({ gifIndex: (i+1)});
        this.getCurrentGif();
      }, currTime * 1000);
    } else {
      this.setState({ gifIndex: -1, currGifUrl: ""});
    }
  }

  // get gifs
  handleClickSearchEntry(i) {
    let selected = this.state.searchResults[i];
    this.setState({
      currSongUri: selected.uri,
      currSongId: selected.id,
      inputValue: selected.title,
      hideTopBtn: false,
      gifIndex: 0,
    }, this.retrieveGifs());
  }

  handleInputChange(e) {
    const val =  e.target.value;
    if (this.state.inputTimeout) {
      this.setState((prevState, props) => {
        inputTimeout: clearTimeout(prevState.inputTimeout);
      });
      this.setState({
        searchResults: [],
        currSongUri : "",
        currSongId : null,
        hideTopBtn : false,
        gifs: [],
        currGifUrl: "",
        // gifIndex: -1,
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

  handlePlay(e) {
    console.log("handling play");
    this.setState({ hideTopBtn : true});
    this.getCurrentGif();
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
          <GifPlayer key="player" currentGif={this.state.currGifUrl} />
        <ReactCSSTransitionGroup
        transitionName="input-anim" transitionAppear={true}
        transitionAppearTimeout={500}
        transitionEnter={false} 
        transitionLeave={false}>
          {
            (this.state.currSongUri !== "") 
            ? <InputForm 
              key="input"
              value={this.state.inputValue} 
              onPlay={this.handlePlay}
              onChange={this.handleInputChange}
              searchResults={this.state.searchResults}
              inputValue={this.state.inputValue}
              hideTopBtn={this.state.hideTopBtn}
              onClickSearchEntry={(i) => this.handleClickSearchEntry(i)}
              currSongUri={this.state.currSongUri}
            />
            : <InputForm 
              key="input"
              value={this.state.inputValue} 
              onPlay={this.handlePlay}
              onChange={this.handleInputChange}
              searchResults={this.state.searchResults}
              hideTopBtn={this.state.hideTopBtn}
              onClickSearchEntry={(i) => this.handleClickSearchEntry(i)}
              currSongUri={this.state.currSongUri}
            />
          }
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

export default Main;

