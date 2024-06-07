const { SlashCommandBuilder } = require('discord.js');
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  entersState,
  VoiceConnectionStatus,
  AudioPlayerStatus,
} = require('@discordjs/voice');
const { Player } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play music')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('song')
        .setDescription('searches for a song')
        .addStringOption((option) =>
          option
            .setName('searchterms')
            .setDescription('search keywords')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('url')
        .setDescription('play a song from url')
        .addStringOption((option) =>
          option
            .setName('url')
            .setDescription('url of the song')
            .setRequired(true),
        ),
    ),
  async execute(interaction) {
    // https://www.npmjs.com/package/discord-player
    // TODO: https://discord-player.js.org/guide/welcome/welcome
    // https://www.youtube.com/watch?v=fN29HIaoHLU

  },
};
