const electron = window.require('electron');
// eslint-disable-next-line prefer-destructuring
const remote = electron.remote;
const { dialog } = remote;
window.electron = {};
window.electron.remote = electron.remote;
window.electron.dialog = dialog;
