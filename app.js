const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv'); // Using dotenv to get discord bot token
const { Player } = require('discord-player');
const { execSync } = require('node:child_process');

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// Initiate player
const player = new Player(client, {
  skipFFmpeg: false, // Avoid ECONNRESET
});

// Load default extractors
player.extractors.loadDefault();

function removeAllDownloads() {
  const downloaded = './downloaded/';
  fs.readdir(downloaded, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      fs.unlinkSync(downloaded + file);
    }
  });
}
player.events.on('emptyQueue', () => removeAllDownloads());
player.events.on('disconnect', () => removeAllDownloads());
// TODO: remove only the played file upon its play completion

// Parse in slash commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith('.js'));

// Load commmands from file
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ('data' in command && 'execute' in command) {
    console.log(`Adding ${command.data.name}.`);
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] the command at ${filePath} is missing a required "data" or "execute" property.`,
    );
  }
}

// Check client status
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Respond to command
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute({ client, interaction });
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content:
          'There was an error while executing this command! (printed to console)',
        ephemeral: true,
      });
    }
  }
});

module.exports = client;

// Log in with client token
dotenv.config();
client.login(process.env.DISCORD_TOKEN);
