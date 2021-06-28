const electron = window.require('electron');
const remote = electron.remote;
const { dialog } = remote;

window.electron = {};
window.electron.remote = electron.remote;
window.electron.dialog = dialog;
