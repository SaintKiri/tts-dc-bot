const { SlashCommandBuilder } = require('discord.js');
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  entersState,
  VoiceConnectionStatus,
} = require('@discordjs/voice');
const { join } = require('node:path');
const { useMainPlayer, QueryType } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('join')
    .setNameLocalizations({
      'zh-CN': '来',
    })
    .setDescription('Let me IN!!!!')
    .setDescriptionLocalizations({
      'zh-CN': '让我康康!',
    }),
  async execute({ interaction }) {
    const authorVoiceChannel = interaction.member?.voice.channel;
    if (!authorVoiceChannel) {
      return interaction.reply(
        'You need to be in a voice channel to use this command.',
      );
    }

    const connection = joinVoiceChannel({
      channelId: authorVoiceChannel.id,
      guildId: authorVoiceChannel.guild.id,
      adapterCreator: authorVoiceChannel.guild.voiceAdapterCreator,
    });

    const player = useMainPlayer();

    const queue = player.nodes.create(interaction.guild);
    await queue.connect(authorVoiceChannel);

    try {
      const filePath = join(__dirname + '/sounds/', 'monday-left-me-broken.mp3');
      result = await player.play(authorVoiceChannel, filePath, {
        searchEngine: QueryType.FILE,
      });

      return interaction.reply(`Joined: ${authorVoiceChannel.name}`);
    } catch (error) {
      console.error(error);
      return interaction.reply('Error joining voice channel!');
    }
  },
};
