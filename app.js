const { QMainWindow } = require("@nodegui/nodegui");

const win = new QMainWindow();
win.show();

global.win = win;
