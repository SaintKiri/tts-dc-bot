const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  entersState,
} = require('@discordjs/voice');
const { Player, QueryType } = require('discord-player');

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

    // Designate the search engine
    // NOTE: Might need to exclude YouTube since they might ban the bot
    await client.player.extractors.loadDefault();

    const queue = await client.player.nodes.create(interaction.guild);
    await queue.connect(authorVoiceChannel);

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

        result = await client.player.search(url, {
          requestedBy: interaction.user,
          searchEngine: QueryType.YOUTUBE_VIDEO,
        });
        break;
      case 'song':
        let searchterms = interaction.options.getString('searchterms');

        await interaction.deferReply(); // Discord requires bot to send acknowledgement within 3 sec

        result = await client.player.search(searchterms, {
          requestedBy: interaction.user,
          searchEngine: QueryType.AUTO,
        });
        break;
    }
    if (result.isEmpty()) return interaction.reply('No results');

    const song = result.tracks[0];
    console.log('We have:', song.title);

    await queue.addTrack(song);
    console.log('Added to queue');
    if (!queue.isPlaying()) await queue.play(song);
    console.log('Now playing');

    // Return song info
    let embed = new EmbedBuilder();
    embed
      .setDescription(`Added **${song.title}** from ${song.url} to the queue`)
      .setThumbnail(song.thumbnail)
      .setFooter({ text: `Duration: ${song.duration}` });
    return interaction.editReply({ embeds: [embed] });

    // TODO: https://discord-player.js.org/guide/welcome/welcome
    // https://www.youtube.com/watch?v=fN29HIaoHLU
  },
};
