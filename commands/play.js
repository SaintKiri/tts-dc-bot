const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  entersState,
  VoiceConnectionStatus,
} = require('@discordjs/voice');
const execSync = require('child_process').execSync;
const { join } = require('node:path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setNameLocalizations({ 'zh-CN': '播放' })
    .setDescription('Play music')
    .setDescriptionLocalizations({ 'zh-CN': '播放音乐' })
    .addSubcommand((subcommand) =>
      subcommand
        .setName('song')
        .setNameLocalizations({ 'zh-CN': '歌曲' })
        .setDescription('searches for a song')
        .setDescriptionLocalizations({ 'zh-CN': '搜索音乐' })
        .addStringOption((option) =>
          option
            .setName('searchterms')
            .setNameLocalizations({ 'zh-CN': '搜索词' })
            .setDescription('search keywords')
            .setNameLocalizations({ 'zh-CN': '关键字' })
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('url')
        .setNameLocalizations({ 'zh-CN': '网址' })
        .setDescription('play a song from url')
        .setDescriptionLocalizations({ 'zh-CN': '从网址播放音乐' })
        .addStringOption((option) =>
          option
            .setName('url')
            .setNameLocalizations({ 'zh-CN': '网址' })
            .setDescription('url of the song')
            .setDescriptionLocalizations({ 'zh-CN': '音乐网址' })
            .setRequired(true),
        ),
    ),
  async execute({ client, interaction }) {
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

    // NOTE: Might be needed later:
    //
    // player.events.on('playerStart', (queue, track) => {
    //   queue.metadata.channel.send(`Started playing **${track.title}**!`);
    // });

    // Parse user input
    switch (interaction.options.getSubcommand()) {
      case 'url':
        let url = interaction.options.getString('url');

        await interaction.deferReply(); // Discord requires bot to send acknowledgement within 3 sec

        const output = execSync(
          `yt-dlp -t aac ${url} -o "downloaded.%(ext)s"`,
        ).toString();
        console.log(output);

        break;
      case 'song':
        let searchterms = interaction.options.getString('searchterms');

        await interaction.deferReply(); // Discord requires bot to send acknowledgement within 3 sec

        // TODO: implement

        break;
    }

    // Target audio file should exist at this point

    // Connect and join channel
    try {
      await entersState(connection, VoiceConnectionStatus.Ready, 10_000);

      const player = createAudioPlayer();
      const resource = createAudioResource('./downloaded.m4a');

      player.play(resource);
      connection.subscribe(player);

      return interaction.followUp(`Playing audio`);
    } catch (error) {
      console.error(error);
      return interaction.followUp('Play command is at fault!');
    }
  },
};
