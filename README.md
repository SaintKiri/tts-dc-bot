# tts-dc-bot

Text-to-Speech Discord Bot
w/ music functionality

## Motivation

Several of my friends on discord is rather shy and don't really use their mic; they can only type to communicate with those of us that uses a mic. This introduce an unnecessary cognitive overhead for those that uses a mic (since we would be switch windows back and forth for most of the time just to check the chat).  
I have also realized that my JavaScript skill is quite rusty. This is a good opportunity to get some experience.

## Invitation

<!-- TODO: Update this link later -->

[link](https://discord.com/api/oauth2/authorize?client_id=1056897753126543392&permissions=4398049658944&scope=bot)

## (npm) packages

- discord.js (`npm install discord.js`)
- dotenv (`npm install dotenv`)
- @discordjs/voice (`npm install @discordjs/voice`)
- @discordjs/opus (`npm install discordjs/opus`)
- libsodium (`npm install libsodium-wrappers`)
- axios (`npm install axios`)

## Notes

[discord.js guide](https://discordjs.guide)  
[discord-player guide](https://discord-player.js.org/guide/welcome/welcome)
Run the bot with `npm start`  
All credential of the bot will be stored in the `.env` file. DO NOT SHARE!

## TODO

1. Bot should be able to join the channel after playing the `元神` command
2. `Skip` command is needed
3. Sound is slightly off when compared to that of native YouTube videos 
