## Request
"Hey cheeseits a need a new bot whenever your ready:  
`:mute USERNAME (timelimit in s, m, h, d)`  
`:purge (number) (purges the messages)`  
`:warn (username)`  
Can you also make it so it DM's the person when they got muted or warned"

## Setup

### How to Run
- Create a new Discord bot
- Add the bot to your desired server
- Open `config.json` and fill in the information
- Run `setup.bat` and wait for it to automatically close when it's finished
- Run `run.bat` to run the bot

### Additional Information
I've put in error catches for absolutely everything that could go wrong with this script as far as user error is concerned, so instead of getting a confusing wall of "error text" in the console, it'll give you simple instructions for how to fix what's not working. Due to the error catching, you could technically skip all of the steps in the `How to Use` section and simply run `run.bat`, then go through and fix the errors one at a time. This code was written with user-friendliness in mind.

## Usage

_The prefix `/` is only used as an example. The prefix can be set to whatever you want in the `config.json` file._

### Mute Command

Use this command to mute a user

**Usage:**
```
/mute <@mention> <time>

For <time>, use a number followed by s, m, h, or d
Example: 10s, 2h, 1d, etc
```
Permission requirement: _Manage Messages_

### Purge Command

Use this command to bulk delete messages from a channel, with ability to limit it to bot messages, user messages, or a specific user

**Usage:**
```
/purge <number>
/purge <number> bot
/purge <number> user
/purge <number> @mention
```
Permission requrement: _Manage Messages_