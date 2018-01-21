import Main from './Main';
import React from 'react';
import ReactDOM from 'react-dom';

window.onSpotifyWebPlaybackSDKReady = () => {
  const token = 'BQAwtTIiB96oElSv5K9lehoJ7GqKdD847a01icTEPaAa2yUrU8DIsu-4cIN1p9QwhpryOczR4_gJ4gHMzdB38pjqI9_4A8UIwDDQURnUHSXFDzbZnx_ajmQon7heAceHxMbUgy5K_OPMT3i3qx6ZrY9e6bua-5Jw6l1D-w';
  const player = new Spotify.Player({
    name: 'Web Playback SDK Quick Start Player',
    getOAuthToken: cb => { cb(token); }
  });

  // Error handling
  player.on('initialization_error', e => { console.error(e); });
  player.on('authentication_error', e => { console.error(e); });
  player.on('account_error', e => { console.error(e); });
  player.on('playback_error', e => { console.error(e); });

  // Playback status updates
  player.on('player_state_changed', state => { console.log(state); });

  // Ready
  player.on('ready', data => {
    let { device_id } = data;
    console.log('Ready with Device ID', device_id);
  });

  // Connect to the player!
  player.connect();
}

ReactDOM.render(<Main/>, document.getElementById('app'));
