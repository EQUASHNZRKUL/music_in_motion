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
        ("https://open.spotify.com/embed?uri=" + props.currSongUri)} width="80" height="80" frameborder="0" allowtransparency="false"></iframe>
    );
  }
}

class GifPlayer extends React.Component {
  render() {
    return(
      <div className="gif-player">
        <div className="gif-wrapper">
          <img src="https://gfycat.com/SpryImpressiveDinosaur" alt="gif"/>>
        </div>
      </div>
    )
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
      gifs: [],
      timings: [],
      inputTimeout: null,
      hideTopBtn: false,
      currGifUrl: "",
      gifIndex: null,
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
          };
          newSearchResults.push(curr);
        }
        this.setState({searchResults : newSearchResults});
      });
  }

  getCurrentGif() {
    if (this.state.gifIndex) {
      let i = this.state.gifIndex;
      let currGif = this.state.gifs[i];
      let currTime = this.state.timings[i];
      this.setState({currGifUrl : currGif});
      setTimeout(() => {
        this.setState({ gifIndex: i++});
      }, currTime);
    }
  }

  // get gifs
  handleClickSearchEntry(i) {
    let selected = this.state.searchResults[i];
  
    this.setState({
      currSongUri: selected.uri,
      inputValue: selected.title,
      hideTopBtn: false,
      gifIndex: null,
      gifs: [],
      timings: [],
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
        currSongUri : "",
        hideTopBtn : false,
        gifIndex: null,
        gifs: [],
        timings: [],
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
    this.setState({ hideTopBtn : true, gifIndex : 0 });
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
        <GifPlayer key="player" gifs={this.state.gifs} timings={this.state.timings} lyirics={this.state.lyrics} />
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

