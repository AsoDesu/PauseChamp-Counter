import tmi from "tmi.js";
import fs from "fs";
import "dotenv/config";

import ejs from "edit-json-file";
let file = ejs("config.json");
console.log(`Loaded Config: ${JSON.stringify(file.read())}`);
if (file.get("channels") == null) {
	file.set("bot-username", "");
	file.set("bot-token", "");
	file.set("channels", [""]);
	file.save();
	console.log("Created config.json, please fill in the required information.");
	process.exit();
}

var pauseChamps = 0;
saveFile("counter.txt", "PauseChamp Counter: " + pauseChamps);

const client = tmi.client({
	identity: {
		username: file.get("bot-username"),
		password: file.get("bot-token"),
	},
	channels: file.get("channels"),
});

client.on("message", (channel: string, state: tmi.ChatUserstate, msg: string, self: boolean) => {
	if (self) return;
	if (msg.toLowerCase().includes("pausechamp")) {
		console.log("PauseChamp detected");
		pauseChamps += 1;
		saveFile("counter.txt", "PauseChamp Counter: " + pauseChamps);
	}
});

client.connect();

function saveFile(path: string, data: any) {
	fs.writeFileSync(`${__dirname}\\${path}`, data, { encoding: "utf-8" });
}
