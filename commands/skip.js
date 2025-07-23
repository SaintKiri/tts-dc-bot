const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const { useQueue } = require('discord-player');

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

    const queue = useQueue(interaction.guild.id);
    if (!queue) {
      return interaction.reply('No active player session');
    }
    if (!queue.isPlaying()) {
      return interaction.reply('No track playing');
    }

    queue.node.skip();
    return interaction.reply('Current track skipped!');
  },
};
