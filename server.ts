/**
 *
 * Got to "https://localhost:4000" to see an instance of the editor.
 *
 */
const express = require("express");
const app = express();

process.title = "node-http-test";

app.use(express.static("./"));

app.listen(4000, () => {
	console.log("Express server is up on port 4000 (CTRL+C to quit)");
});
