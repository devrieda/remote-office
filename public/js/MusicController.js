export default class MusicController {
  constructor() {
    this.player = null;
  }

  setPlayer(player) {
    this.player = player;
  }

  playTheme(speed = 1) {
    const audio = this.player.playTrack('main');
    audio.playbackRate = speed;
  }

  pause() {
    this.player.pauseAll();
  }
}
