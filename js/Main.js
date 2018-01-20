import React from 'react';

function Logo(props) {
  return (<h1 className="logo">
      <i className="fa fa-music" aria-hidden="true"></i> 
        music n motion
</h1>);
}

function InputForm(props) {
  return (
      <form id="form" className="input-form" onSubmit={() => props.onSubmit()}>
        <div className="input-wrapper">

          <input type="text" className="input" name="input" 
            onChange={() => props.onChange}
            placeholder="search for a song, see it in motion"
            autoComplete="off"/>
          <p className="placeholder">
            <i className="fa fa-search" aria-hidden="true"></i>
          </p>
        </div>
        <button type="submit" form="form" className="input-btn" name="submit">
          <i className="fa fa-play" aria-hidden="true"></i>
        </button>
      </form>
    );
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    // this.handleInputChange = this.handleInputChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      inputValue: "", 
      searchResults: [],
      currSong: "",
      gifs: [],
      lyrics: [],
      timings: [],    
    };
  }

  handleInputChange(e) {
    this.setState({ inputValue: e.target.value });
  }

  render() {
    return (
      <div>
        <Logo />
        <InputForm 
        value={this.state.inputValue} 
        onSubmit={this.handleSubmit}
        onChange={this.handleInputChange}
        />
      </div>
    );
  }
}

export default Main;

