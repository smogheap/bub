let fs = require("fs");

let INPUT = "BUB.HEX";

let args = process.argv.slice(2);
if(args.length >= 1) {
	INPUT = args[0];
}


/* read data from file */
let data = fs.readFileSync(INPUT, {encoding: "utf8"}).split("\r\n");
data.forEach(function(line) {
	console.log("\"" + line + "\",");
});
