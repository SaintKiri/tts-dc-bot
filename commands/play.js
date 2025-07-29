const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const {
  joinVoiceChannel
} = require('@discordjs/voice');
const { useMainPlayer, QueryType } = require('discord-player');
const { join, relative } = require('path');
const { readdirSync } = require('fs');
const { execSync } = require('child_process');
const path = require('node:path');

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
        let result = sanitizeURL(interaction.options.getString('url'));
        if (result == null) {
          return interaction.reply("Invalid URL");
        }
        const [url, videoID] = result;
        await interaction.deferReply(); // Discord requires bot to send acknowledgement within 3 sec

        await interaction.editReply('Downloading...');
        try {
          execSync(`yt-dlp -t mp4 --add-metadata --embed-thumbnail ${url}`, { cwd: path.join('downloaded') });
        } catch (err) {
          // return interaction.editReply('Error while downloading media. Check if the url is correct:' + url);
          const returnEmbed = new EmbedBuilder().setTitle('ERROR: check media URL').setDescription(url).setURL(url);
          console.log(interaction);
          return interaction.editReply({ embeds: [returnEmbed] });
        }

        const filePath = findFilePathByVideoID(videoID);
        if (filePath == null) {
          console.error('Unable to find', filePath);
          return interaction.editReply('Error: cannot find downloaded file. Please let the developer know');
        }

        var trackInfo = await player.play(authorVoiceChannel, filePath, {
          searchEngine: QueryType.FILE,
        });

        break;
      case 'song':
        return interaction.editReply('Unimplemented. Please play by url');
      // let searchterms = interaction.options.getString('searchterms');
      // await interaction.deferReply(); // Discord requires bot to send acknowledgement within 3 sec

      // // FIXME: not working
      // var trackInfo = await player.play(authorVoiceChannel, searchterms, {
      //   nodeOptions: {
      //     metadata: {
      //       channel: interaction.channel,
      //     },
      //   },
      // });
      // break;
    }
    // TODO: use embed builder to make reply pretty
    // thumbnail: https://img.youtube.com/vi/[videoID]/default.jpg
    // https://api.bilibili.com/x/web-interface/view?bvid=[videoID] then look for the pic url
    return interaction.editReply(`Playing: ${trackInfo.track.title}`);
  },
  sanitizeBilibiliURL, sanitizeYouTubeURL, sanitizeURL
};

function sanitizeBilibiliURL(url) {
  const regexBB = /(?:https?:\/\/)?(?:www\.)?(?:bilibili\.com\/video\/(BV[0-9A-Za-z]{10}|av\d+)|b23\.tv\/(BV[0-9A-Za-z]{10}))/;
  const match = url.match(regexBB);

  return (match == null) ? null : [`https://www.bilibili.com/video/${match[1]}`, match[1]];
}
function sanitizeYouTubeURL(url) {
  const regexYT = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regexYT);

  return (match == null) ? null : [`https://www.youtube.com/watch?v=${match[1]}`, match[1]];
}
function sanitizeURL(url) {
  if (typeof url !== 'string') return null;
  if (url.includes('bilibili.com')) return sanitizeBilibiliURL(url);
  if (url.includes('youtube.com') || url.includes('youtu.be')) return sanitizeYouTubeURL(url);
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