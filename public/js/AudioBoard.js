export default class AudioBoard {
  constructor() {
    this.buffers = new Map();
  }

  addAudio(name, buffer) {
    this.buffers.set(name, buffer);
  }

  playAudio(name, audioContext) {
    const source = audioContext.createBufferSource();
    source.connect(audioContext.destination);
    source.buffer = this.buffers.get(name);
    source.start(0);
  }
}
