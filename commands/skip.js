const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
// const { createReadStream } = require('node:fs'); // might be neede for non-mp3 files, also reference https://discordjs.guide/voice/audio-resources.html#cheat-sheet
const { join } = require('node:path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setNameLocalizations({
      'zh-CN': '跳过',
    })
    .setDescription('Skip the current track')
    .setDescriptionLocalizations({
      'zh-CN': '跳过现在播放的音轨',
    }),
  async execute({ interaction }) {
    const authorVoiceChannel = interaction.member?.voice.channel;
    if (!authorVoiceChannel) {
      return interaction.reply(
        'You need to be in a voice channel to use this command.',
      );
    }

    try {
      // FIXME: connection is undefined
      const connection = getVoiceConnection(authorVoiceChannel);

      const subscription = connection.subscribe(player);
      subscription.unsubscribe();

      connection.destroy();

      return interaction.reply('Skipping current track');
    } catch (error) {
      console.error(error);
      return interaction.reply('Error joining voice channel!');
    }
  },
};
