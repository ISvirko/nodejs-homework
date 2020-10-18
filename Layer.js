var Layer = require("express/lib/router/layer");
/*
    // https://github.com/expressjs/express/blob/9302acc5e449768b3ca2b03701d5379d86453af5/lib/router/layer.js
    // Target Function:

    Layer.prototype.handle_request = function handle(req, res, next) {
        var fn = this.handle;

        if (fn.length > 3) {
            // not a standard request handler
            return next();
        }

        try {
           fn(req, res, next);
        } catch (err) {
           next(err);
        }
    };
*/

if (!Layer.prototype.handle_request) {
  throw new Error(
    "Something terribly wrong just happened, " +
      "there are no `Layer.prototype.handle_request` to apply patch to."
  );
}

Layer.prototype.handle_request = function handle(req, res, next) {
  var fn = this.handle;

  if (fn.length > 3) {
    // not a standard request handler
    return next();
  }

  try {
    var maybe_promise = fn(req, res, next);
    if (
      maybe_promise &&
      maybe_promise.catch &&
      typeof maybe_promise.catch === "function"
    ) {
      maybe_promise.catch(next);
    }
  } catch (err) {
    next(err);
  }
};
