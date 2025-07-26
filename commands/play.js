const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const {
  joinVoiceChannel
} = require('@discordjs/voice');
const { useMainPlayer, QueryType } = require('discord-player');
const { join, relative } = require('path');
const { readdirSync } = require('fs');
const execSync = require('child_process').execSync;

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

    const player = useMainPlayer();

    const queue = player.nodes.create(interaction.guild);
    await queue.connect(authorVoiceChannel);

    // TODO: implement queue functionality

    // TODO: display information as reply
    // ffprobe -v quiet -show_format -print_format json [VIDEO]

    // Parse user input
    switch (interaction.options.getSubcommand()) {
      case 'url':
        const [url, videoID] = sanitizeURL(interaction.options.getString('url')); // TODO: reject invalid url
        await interaction.deferReply(); // Discord requires bot to send acknowledgement within 3 sec

        interaction.editReply('Downloading...');
        const output = execSync(
          `cd downloaded; yt-dlp -t mp4 --add-metadata ${url}`,
        ).toString();
        console.log(output);

        const filePath = findFilePathByVideoID(videoID); // TODO: reject invalid url

        result = await player.play(authorVoiceChannel, filePath, {
          searchEngine: QueryType.FILE,
        });

        break;
      case 'song':
        return interaction.editReply('Unimplemented. Please play by url');
      // let searchterms = interaction.options.getString('searchterms');
      // await interaction.deferReply(); // Discord requires bot to send acknowledgement within 3 sec

      // // FIXME: not working
      // result = await player.play(authorVoiceChannel, searchterms, {
      //   nodeOptions: {
      //     metadata: {
      //       channel: interaction.channel,
      //     },
      //   },
      // });
      // break;
    }
    return interaction.editReply(`Playing: ${result.track.title}`);
  },
};

function sanitizeURL(url) {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  const videoID = match[1];
  console.log(match + '\n' + videoID);

  if (!match || !videoID) {
    return null;
  }

  return [`https://www.youtube.com/watch?v=${videoID}`, videoID];
}

function findFilePathByVideoID(videoID) {
  const downloaded = 'downloaded';
  const files = readdirSync(downloaded); // Commands are imported to main. Need to look from main's perspective
  for (const file of files) {
    if (file.includes(videoID)) {
      return relative(process.cwd(), join(downloaded, file));
    }
  }
  return null;
}