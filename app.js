var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/redbaron');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
   console.log("connected to mongodb");
});

var BossSchema = mongoose.Schema({
    text: String
});

BossSchema.statics.random = function(callback) {
  this.count(function(err, count) {
    if (err) return callback(err);
    var rand = Math.floor(Math.random() * count);
    this.findOne().skip(rand).exec(callback);
  }.bind(this));
};

function chooseRandom(err,text){
  if (err) { console.log('error with chooseRandom');}
  var RandomBoss = text.toObject();
   bot.say(config.channels[0],RandomBoss.text + '... like a boss!!!');
}


var Boss = mongoose.model('Boss', BossSchema);

var config = {
  channels: ["#redbaron"],
  server: "us.undernet.org",
  botName: "redbaron"
};

var irc = require("irc");

var bot = new irc.Client(config.server, config.botName, {
  channels: config.channels
});

bot.addListener("join", function(channel, who) {
  if (config.botName != who)
  {
    bot.say(channel, who + ", welcome!");
  }
});

bot.addListener("message#redbaron", function(from, to, text, message) {
  console.log("Debugging: " + " From : " + from + " To: " + to + " Text " + text + " Message: " + message);
  var is_command_and_quote = /^(@boss)\s+?(.+)/;
  var is_command = /^@boss$/;

  if(is_command_and_quote.test(to))
  {
     var match = is_command_and_quote.exec(to);
     //bot.say(config.channels[0], message_txt + ' ... like a boss?');
     console.log("Attempting to create boss document...");
     var boss = new Boss({ text: match[2] });
     boss.save( function (err) {
       if (err) return console.error(err);
     });
  }
  else if(is_command.test(to))
  {
     Boss.random(chooseRandom);
  }
});
