import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import axios from 'axios';

class Logo extends React.Component{
  render() {
    return (<h1 id="logo" className="logo">
      <a href="/">
        <i className="fa fa-music" aria-hidden="true"></i> 
        music n motion
      </a>
       </h1>);
  }
}

function LoadingOverlay(props) {
  if (props.isLoading) {
    return (<div className="loading-overlay">
      <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
      <span className="sr-only">Loading...</span>
    </div>);
  } else {
    return "";
  }
}

function NotFoundMessage(props) {
  if (props.notFound) {
    return (
      <div className="not-found-wrapper">
        <h1 className="not-found">No gifs found</h1>
      </div>
    );
  } else {
    return "";
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
          {/* <div className="lyrics-wrapper">
            <p className="lyrics">Tesst amsldkfmkasd asdkfksdmf</p>
          </div> */}
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
      isLoading: false,
      notFound: false,
      selectedSong: null,
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
    let data = { songId : this.state.currSongId, songTitle : this.state.inputValue, artist : this.state.selectedSong.artist };
    console.log(data);
    this.setState({
      isLoading: true,
    });
    axios.post('/getGifs', data)
      .then(res => {
        this.setState({
          gifs: res.data.gifs,
          isLoading: false,
        });
      });
  }

  getCurrentGif() {
    if (this.state.gifIndex > 0 && this.state.gifIndex < this.state.gifs.length
                                && this.state.gifs.length > 0) {
      let i = this.state.gifIndex;
      console.log(this.state)
      let currGif = this.state.gifs[i][0];
      console.log(currGif);
      let currTime = this.state.gifs[i][1];
      console.log(currTime);
      this.setState({currGifUrl : currGif});
      setTimeout(() => {
        this.setState({ gifIndex: (i+1)});
        this.getCurrentGif();
      }, currTime * 1000);
    } else if (this.state.gifIndex === 0 && this.state.gifs.length > 0) {
      setTimeout(() => {
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
      }, 2000);
    } else {
      this.setState({ gifIndex: -1, currGifUrl: ""});
    }
  }

  // get gifs
  handleClickSearchEntry(i) {
    let selected = this.state.searchResults[i];
    console.log(selected);
    this.setState({
      currSongUri: selected.uri,
      currSongId: selected.id,
      inputValue: selected.title,
      hideTopBtn: false,
      gifIndex: -1,
      selectedSong: selected
    },  () => {
      console.log(this.state);
      this.retrieveGifs();
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
        currSongId : null,
        hideTopBtn : false,
        gifs: [],
        currGifUrl: "",
        notFound: false,
        selectedSong: null,
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
    if (this.state.gifs.length === 0) {
      this.setState({notFound: true});
    } else {
      this.setState({ hideTopBtn : true, gifIndex: 0, notFound:false}, () => {
        this.getCurrentGif();
      });
    }
  }

  render() {
    return (
      <div>
        <NotFoundMessage notFound={this.state.notFound} />
        <LoadingOverlay isLoading={this.state.isLoading} />
        <ReactCSSTransitionGroup
        transitionName="logo-anim" transitionAppear={true}
        transitionAppearTimeout={500}
        transitionEnter={false} 
        transitionLeave={false}>
          <Logo key="logo"/>
        </ReactCSSTransitionGroup>
        <ReactCSSTransitionGroup
        transitionName="gifplayer-anim"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}>
          <GifPlayer key="player" currentGif={this.state.currGifUrl} />
        </ReactCSSTransitionGroup>
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

