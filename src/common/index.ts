export function readTextFile(file: string, callback: any) {
  const rawFile = new XMLHttpRequest();
  rawFile.open('GET', file, false);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status === 0) {
        if (callback) callback(rawFile);
      }
    }
  };
  rawFile.send(null);
}
