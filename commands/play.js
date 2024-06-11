const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  entersState,
  VoiceConnectionStatus,
  AudioPlayerStatus,
} = require('@discordjs/voice');
const { Player, QueryType } = require('discord-player');

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
    if (!queue.connection) await queue.connect(authorVoiceChannel);

    // NOTE: Might be needed later:
    //
    // player.events.on('playerStart', (queue, track) => {
    //   queue.metadata.channel.send(`Started playing **${track.title}**!`);
    // });

    // Parse user input
    let result;
    switch (interaction.options.getSubcommand()) {
      case 'url':
        let url = interaction.options.getString('url');

        result = await client.player.search(url, {
          requestedBy: interaction.user,
          searchEngine: QueryType.YOUTUBE_VIDEO,
        });
    }
    if (result.isEmpty()) return interaction.reply('No results');

    const song = result.tracks[0];

    await queue.addTrack(song);
    if (!queue.isPlaying()) await queue.play(song);

    let embed = new EmbedBuilder();
    embed
      .setDescription(`Added **${song.title}** to the queue`)
      .setThumbnail(song.thumbnail)
      .setFooter({ text: `Duration: ${song.duration}` });
    return interaction.reply({ embeds: [embed] });

    // TODO: https://discord-player.js.org/guide/welcome/welcome
    // https://www.youtube.com/watch?v=fN29HIaoHLU
  },
};
