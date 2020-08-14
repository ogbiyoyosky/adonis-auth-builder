"use strict";
const Config = use("Config");

class ViewHelper {
  async handle({ view }, next) {
    view.share({
      Config: Config
    });
    // call next to advance the request
    await next();
  }
}

module.exports = ViewHelper;
