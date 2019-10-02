# Request
"Hey cheeseits a need a new bot whenever your ready:  
`:mute USERNAME (timelimit in s, m, h, d)`  
`:purge (number) (purges the messages)`  
`:warn (username)`  
Can you also make it so it DM's the person when they got muted or warned"
# Setup
### How to Run
- Create a new Discord bot
- Add the bot to your desired server
- Open `config.json` and fill in the information
- Run `setup.bat` and wait for it to automatically close when it's finished
- Run `run.bat` to run the bot
### Additional Information
I've put in error catches for absolutely everything that could go wrong with this script as far as user error is concerned, so instead of getting a confusing wall of "error text" in the console, it'll give you simple instructions for how to fix what's not working. Due to the error catching, you could technically skip all of the steps in the `How to Run` section and simply run `run.bat`, then go through and fix the errors one at a time. This code was written with user-friendliness in mind.
# Usage
_The prefix `/` is only used as an example. The prefix can be set to whatever you want in the `config.json` file._
### Mute Command
_Use this command to mute a user_

Effectively blocks a user from being able to chat by deleting that user's messages as soon as they are sent, up until either the timer expires or a staff member uses the `unmute` command. Users are notified that they have been muted via Direct Message, unless they haven't allowed the bot permission to DM them.

**Usage:**
```
/mute <@mention> <time>

For <time>, use a number followed by s, m, h, or d
Example: 10s, 2h, 1d, etc
```
Permission requirement: _Manage Messages_
***
### Purge Command
_Use this command to delete multiple messages from a channel at once_

Deletes the most recent messages by default, but you can use additional command arguments to limit it to bot messages, user messages, or messages from one specific user.

**Usage:**
```
/purge <number>
/purge <number> bot
/purge <number> user
/purge <number> @mention
```
Permission requrement: _Manage Messages_
***
### Unmute Command
_Use this command to unmute a user_

Removes the user from the database of muted users, allowing them to speak freely again.

**Usage:**
```
/unmute <@mention>
```
Permission requirement: _Manage Messages_
***
### Warn Command
_Use this command to warn a user for bad behavior_

Sends a message to the Warn Channel (set in `config.json`) stating the user warned and the reason for it. Unless permission is denied by the warned user, the bot will also send a Direct Message to them stating what they have been warned for.

**Usage:**
```
/warn <@mention> <reason>
```
Permission requirement: _Manage Messages_
