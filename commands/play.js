const { SlashCommandBuilder } = require('discord.js');
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  entersState,
  VoiceConnectionStatus,
  AudioPlayerStatus,
} = require('@discordjs/voice');

require('dotenv').config();

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
    // https://github.com/steffenkabus/node-youtube-music

    // TODO: download audio at url
    const musics = await searchMusics('Never gonna give you up');

    // TODO: play audio

    return interaction.reply(`Playing ${retString}`);
  },
};
