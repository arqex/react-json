module.exports = function(markup) {
   if (typeof document !== 'undefined') return
   var jsdom          = require("jsdom").jsdom
   global.document    = jsdom(markup || '<html><body></body></html>')
   global.window      = document.createWindow();
}
