const Discord = require("discord.js");
const request = require("request");
exports.run = async (client, message, args, level) => {
  const subreddit = args.join(" ");
  if (!subreddit) return message.reply(":x: Please provide a valid subreddit!");

  // Start typing
  message.channel.startTyping();

  request("https://www.reddit.com/r/"+ subreddit + "/random/.json", { json: true }, function(err, res, body) {
    if (err) return console.error(err);
    const post = body[0].data.children[0].data;
    const url = `https://reddit.com${post.permalink}`;
    const image = post.url;
    const title = post.title;
    const upvotes = post.ups;
    const downvotes = post.downs;
    const comments = post.num_comments;

    const embed = new Discord.RichEmbed()
      .setColor(0xFF5700)
      .setImage(image)
      .addField(title, `[View Thread](${url})`)
      .setFooter(`\u{1F44D} ${upvotes} \u{1F44E} ${downvotes} \u{1F5E8} ${comments}`);
    console.log(`Sent a reply to ${message.author.username}`);

    // Send the finished embed and stop typing
    message.channel.send(embed);
    return message.channel.stopTyping();
  }).catch(err => {
    message.reply(":x: There was a problem getting that from Reddit. Maybe request doesn't support that subreddit? :thinking:");
    const details = new Discord.RichEmbed()
      .setTitle("Full Error Details")
      .setDescription(error)
      .setTimestamp();
    message.channel.send(details);
  });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "reddit",
  category: "fun",
  description: "Search for a random image in a subreddit.",
  usage: "reddit [r/subreddit]"
};