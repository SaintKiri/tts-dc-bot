const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv'); // Using dotenv to get discord bot token
const { Player } = require('discord-player');

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
client.player = new Player(client, {
  skipFFmpeg: false, // Avoid ECONNRESET
});

// Parse in slash commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ('data' in command && 'execute' in command) {
    console.log(`Added ${command.data.name}.`);
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
          'There was an error while executing this command! (Printed to console)',
        ephemeral: true,
      });
    }
  }
});

module.exports = client;

// Log in with client token
dotenv.config();
client.login(process.env.DISCORD_TOKEN);
