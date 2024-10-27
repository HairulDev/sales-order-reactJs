import fs from "fs";
import moment from "moment";

const now = new Date().getTime();

const jsonData = {
	lastBuildTimestamp: now,
	lastBuildJakartaTime: moment(now).utcOffset("+0700").toLocaleString(),
};

const jsonContent = JSON.stringify(jsonData);

fs.writeFile("./dist/meta.json", jsonContent, "utf8", function (error) {
	if (error) {
		console.log(
			"An error occured while saving build date and time to meta.json",
		);
		return console.log(error);
	}

	console.log("Latest build date and time updated in meta.json file");
});
