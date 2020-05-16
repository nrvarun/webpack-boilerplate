import "core-js/stable";
import "regenerator-runtime/runtime";

import "../scss/main.scss";

if (process.env.NODE_ENV === "development") {
  require("../pug/index.pug");
  require("../pug/about.pug");
}

console.log("Hi, my name is Common!"); // eslint-disable-line no-console
