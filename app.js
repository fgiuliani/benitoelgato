const Twit = require("twit");
const fs = require("fs");

const config = require("./config.js");

const T = new Twit(config);

var stream = T.stream("statuses/filter", {
  track: "@benito_el_gato"
});

stream.on("tweet", function(tweet) {
  console.log(tweet);

  uploadRandomImage(tweet.user.screen_name);
});

function uploadRandomImage(user) {
  var files = fs.readdirSync("./images/");
  var chosenFile = files[Math.floor(Math.random() * files.length)];
  var imagePath = "./images/" + chosenFile;
  var b64content = fs.readFileSync(imagePath, { encoding: "base64" });

  T.post("media/upload", { media_data: b64content }, function(
    err,
    data,
    response
  ) {
    if (err) {
      console.log(err);
    } else {
      T.post(
        "statuses/update",
        {
          status: "@" + user + " acá te paso una foto mía",
          media_ids: new Array(data.media_id_string)
        },
        function(err, data, response) {
          if (err) {
            console.log(err);
          } else {
            console.log("Posted an image!");
          }
        }
      );
    }
  });
}
