console.clear();

const fs = require("fs");
const Discord = require("discord.js");
const config = require("./config.json");
const mutedUsers = require("./mutedUsers.json");

let i = 0;
Object.entries(config).forEach(e => {
  if (!e[1]) {
    console.log(`Must set "${e[0]}" in config.json`);
    i++
  }
})
if (i > 0) process.exit();

const client = new Discord.Client();

function textSplit(input, i) {
  return input.split(" ")[i];
}

function commandRemove(input, n) {
  if (!n) n = 1;
  let args = input.split(" ");
  while (n) {
    args.shift();
    n--;
  }
  return args.join(" ");
}

client.on("ready", () => {
  if (!client.channels.has(config.warnChannel)) {
    console.log("Invalid warn channel ID was provided");
    process.exit();
  }
  client.fetchUser(config.owner).then(user => {
    client.owner = user;
    console.log(`Logged in as @${client.user.tag}, owned by @${client.owner.tag}`);
  }).catch(err => {
    console.log("Invalid owner ID was provided");
    process.exit();
  })
});

client.on("message", msg => {
  if (Object.keys(mutedUsers).includes(msg.author.id)) {
    if (mutedUsers[msg.author.id] - (new Date).getTime() > 0) msg.delete();
    else {
      delete mutedUsers[msg.author.id];
      fs.writeFileSync("mutedUsers.json", JSON.stringify(mutedUsers), "utf8");
    }
  }
  if (msg.member.bot) return;
  if (!msg.content.startsWith(config.prefix)) return;

  if (msg.content.startsWith(`${config.prefix}help`)) {
    switch (textSplit(msg.content, 1)) {
      case "mute":
        msg.channel.send(`**Mute Command:**\nUse this command to mute a user\n\n**Usage:**\`\`\`${config.prefix}mute <@mention> <time>\n\nFor <time>, use a number followed by s, m, h, or d\nExample: 10s, 2h, 1d, etc\`\`\`\nPermission requirement: _Manage Messages_`);
        break;
      case "purge":
        msg.channel.send(`**Purge Command:**\nUse this command to bulk delete messages from a channel, with ability to limit it to bot messages, user messages, or a specific user\n\n**Usage:**\`\`\`${config.prefix}purge <number>\n${config.prefix}purge <number> bot\n${config.prefix}purge <number> user\n${config.prefix}purge <number> @mention\`\`\`\nPermission requirement: _Manage Messages_`);
        break;
      case "unmute":
        msg.channel.send(`**Unmute Command:**\nUse this command to unmute a user\n\n**Usage:**\`\`\`${config.prefix}unmute <@mention>\`\`\`\nPermission requirement: _Manage Messages_`);
        break;
      case "warn":
        msg.channel.send(`**Warn Command:**\nUse this command to warn a user for bad behavior\n\n**Usage:**\`\`\`${config.prefix}warn <@mention> <reason>\`\`\`\nPermission requirement: _Manage Messages_`)
        break;
      default:
        msg.channel.send(`Command \`${config.prefix}${textSplit(msg.content, 1)}\` doesn't exist`);
        break;
    }
  }

  if (msg.content.startsWith(`${config.prefix}mute`)) {
    if (msg.member.hasPermission(8192)) {
      if (textSplit(msg.content, 2)) {
        let user;
        if (msg.mentions.users.first()) user = msg.mentions.users.first();
        if (user) {
          let time = /(\d+)(s|m|h|d)/.exec(textSplit(msg.content, 2));
          if (time) {
            let muteTime;
            switch (time[2]) {
              case "s":
                muteTime = time[1] * 1000;
                break;
              case "m":
                muteTime = time[1] * 1000 * 60;
                break;
              case "h":
                muteTime = time[1] * 1000 * 60 * 60;
                break;
              case "d":
                muteTime = time[1] * 1000 * 60 * 60 * 24;
                break;
            }
            mutedUsers[user.id] = (new Date).getTime() + muteTime;
            fs.writeFileSync("mutedUsers.json", JSON.stringify(mutedUsers), "utf8");
            msg.channel.send(`Muted **${user.tag}** for **${textSplit(msg.content, 2)}**`);
            user.send(`You've been muted by the staff of **${msg.guild.name}** for **${textSplit(msg.content, 2)}**`).catch(err => {
              msg.channel.send("Unable to notify user through DMs");
            });
          } else msg.channel.send("One or more arguments are invalid");
        } else msg.channel.send("One or more arguments are invalid");
      } else msg.channel.send(`Missing arguments; use \`${config.prefix}help <command>\` for proper usage`);
    } else msg.channel.send("This command can only be executed by a member with the ​`Manage Messages​` permission");
  }

  if (msg.content.startsWith(`${config.prefix}ping`)) {
    msg.channel.send(`**Ping:** \`${client.ping}ms\``);
  }

  if (msg.content.startsWith(`${config.prefix}purge`)) {
    if (msg.member.hasPermission(8192)) {
      if (textSplit(msg.content, 1)) {
        if (Number.isInteger(parseInt(textSplit(msg.content, 1)))) {
          if (textSplit(msg.content, 1) > 99) {
            msg.channel.send("Input must be less than or equal to 99")
          } else {
            if (textSplit(msg.content, 2)) {
              switch (textSplit(msg.content, 2)) {
                case "bot":
                  msg.channel.fetchMessages({
                    limit: parseInt(textSplit(msg.content, 1)) + 1
                  }).then(messages => {
                    let botMessages = [];
                    messages.forEach(message => {
                      if (message.author.bot) botMessages.push(message);
                    })
                    msg.channel.bulkDelete(botMessages).then(m => {
                      msg.channel.send(`**${botMessages.length}** messages deleted by **${msg.author.tag}**`);
                    }).catch(() => {
                      msg.channel.send("This command can only be executed if the bot has the ​`Manage Messages​` permission");
                    })
                  })
                  break;
                case "user":
                  msg.channel.fetchMessages({
                    limit: parseInt(textSplit(msg.content, 1)) + 1
                  }).then(messages => {
                    let userMessages = [];
                    messages.forEach(message => {
                      if (!message.author.bot) userMessages.push(message);
                    })
                    msg.channel.bulkDelete(userMessages).then(m => {
                      msg.channel.send(`**${userMessages.length}** messages deleted by **${msg.author.tag}**`);
                    }).catch(() => {
                      msg.channel.send("This command can only be executed if the bot has the ​`Manage Messages​` permission");
                    })
                  })
                  break;
                default:
                  let user;
                  if (msg.mentions.users.first()) user = msg.mentions.users.first();
                  if (user) {
                    msg.channel.fetchMessages({
                      limit: parseInt(textSplit(msg.content, 1)) + 1
                    }).then(messages => {
                      let userMessages = [];
                      messages.forEach(message => {
                        if (message.author.id == user.id) userMessages.push(message);
                      })
                      msg.channel.bulkDelete(userMessages).then(m => {
                        msg.channel.send(`**${userMessages.length}** messages deleted by **${msg.author.tag}**`);
                      }).catch(() => {
                        msg.channel.send("This command can only be executed if the bot has the ​`Manage Messages​` permission");
                      })
                    })
                  } else msg.channel.send("One or more arguments are invalid");
                  break;
              }
            } else {
              msg.channel.bulkDelete(parseInt(textSplit(msg.content, 1)) + 1).then(m => {
                msg.channel.send(`**${textSplit(msg.content, 1)}** messages deleted by **${msg.author.tag}**`);
              }).catch(() => {
                msg.channel.send("This command can only be executed if the bot has the ​`Manage Messages​` permission");
              })
            }
          }
        } else msg.channel.send("Command input must be a number");
      } else msg.channel.send(`Missing arguments; use \`${config.prefix}help <command>\` for proper usage`);
    } else msg.channel.send("This command can only be executed by a member with the ​`Manage Messages​` permission");
  }

  if (msg.content.startsWith(`${config.prefix}unmute`)) {
    if (msg.member.hasPermission(8192)) {
      if (textSplit(msg.content, 1)) {
        let user;
        if (msg.mentions.users.first()) user = msg.mentions.users.first();
        if (user) {
          if (Object.keys(mutedUsers).includes(user.id)) {
            delete mutedUsers[user.id];
            fs.writeFileSync("mutedUsers.json", JSON.stringify(mutedUsers), "utf8");
            msg.channel.send(`User **${user.tag}** has been unmuted`);
          } else msg.channel.send(`User **${user.tag}** is not muted`);
        } else msg.channel.send("One or more arguments are invalid");
      } else msg.channel.send(`Missing arguments; use \`${config.prefix}help <command>\` for proper usage`);
    } else msg.channel.send("This command can only be executed by a member with the ​`Manage Messages​` permission");
  }

  if (msg.content.startsWith(`${config.prefix}warn`)) {
    if (msg.guild) {
      if (textSplit(msg.content, 2)) {
        if (msg.member.hasPermission(8192)) {
          if (client.channels.get(config.warnChannel)) {
            if (client.users.get(textSplit(msg.content, 1).substr(2).slice(0, -1))) {
              let user = client.users.get(textSplit(msg.content, 1).substr(2).slice(0, -1));
              client.channels.get(config.warnChannel).send(`${textSplit(msg.content, 1)} has been warned for _${commandRemove(commandRemove(msg.content))}_`);
              user.send(`You've been warned by the staff of **${msg.guild.name}** for _${commandRemove(commandRemove(msg.content))}_`).then(() => {
                msg.channel.send("Warning posted in Warn Channel, user has been sent a DM of their warning");
              }).catch(err => {
                msg.channel.send("Warning posted in Warn Channel, unable to contact user through DMs");
              });
            } else msg.channel.send("One or more arguments are invalid");
          } else msg.channel.send("Warning channel is invalid or not set. Set it in `config.json` (can only be done by bot host)");
        } else msg.channel.send("This command can only be executed by a member with the ​`Manage Messages​` permission");
      } else msg.channel.send(`Missing arguments; use \`${config.prefix}help <command>\` for proper usage`);
    } else msg.channel.send("This command can only be executed in a server");
  }

});

client.login(config.token).catch(err => {
  if (err.message === "getaddrinfo ENOTFOUND discordapp.com") console.log("Unable to connect to discordapp.com (check network)");
  else if (err.message === "Incorrect login details were provided.") console.log("Invalid bot token was provided");
});