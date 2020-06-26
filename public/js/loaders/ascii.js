export function loadAscii(name) {
  return fetch(`/ascii/${name}.txt`).then(r => r.text());
}
