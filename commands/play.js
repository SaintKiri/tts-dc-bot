const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, VoiceConnectionStatus, AudioPlayerStatus} = require('@discordjs/voice');
const axios = require('axios');

require('dotenv').config();
const YOUTUBE_KEY = process.env.YOUTUBE_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';
const YOUTUBE_VIDEO_API_URL = 'https://www.googleapis.com/youtube/v3/videos';

module.exports = {
	data: new SlashCommandBuilder()
	.setName('play')
	.setDescription('Play music')
	.addSubcommand(subcommand =>
		subcommand
		.setName("song")
		.setDescription("searches for a song")
		.addStringOption(option =>
			option.setName("searchterms")
			.setDescription("search keywords")
			.setRequired(true)
		)
	)
	.addSubcommand(subcommand =>
		subcommand
		.setName("url")
		.setDescription("play a song from url")
		.addStringOption(option =>
			option.setName("url")
			.setDescription("url of the song")
			.setRequired(true)
		)
	),
	async execute(interaction) {
		let url;
		let retString;

		if (interaction.options.getSubcommand() === 'song') {
			let song_name = interaction.options.getString('searchterms');
			let res = await searchYT(song_name);
			console.log(res);
		} else if (interaction.options.getSubcommand() === 'url') {
			url = interaction.options.getString('url');

			// TODO: verify url
		}

		// TODO: download audio at url

		// TODO: play audio

		return interaction.reply(`Playing ${retString}`);
	},
};

async function searchYT(query) {
	try {
		let response = await axios.get(YOUTUBE_API_URL, {
			params: {
				part: 'snippet',
				type: 'video',
				q: query,
				key: YOUTUBE_KEY,
			},
		});

		const videos = response.data.items;

		if (videos.length > 0) {
			const firstVideo = videos[0]; // gets the first video of search result
			// basic info
			const videoTitle = firstVideo.snippet.title;
			const uploader = firstVideo.snippet.channelTitle;
			const videoId = firstVideo.id.videoId;

			response = await axios.get(YOUTUBE_VIDEO_API_URL, {
				params: {
					part: 'contentDetails', 
					id: videoId,
					key: YOUTUBE_KEY,
				},
			});
			const contentDetails = response.data.items[0].contentDetails;
			response = await axios.get(YOUTUBE_VIDEO_API_URL, {
				params: {
					part: 'statistics', 
					id: videoId,
					key: YOUTUBE_KEY,
				},
			});
			const statistics = response.data.items[0].statistics;
			// video stats
			const length = contentDetails.duration;
			const views = statistics.viewCount;
			const likes = statistics.likeCount;

			let url = 'https://youtu.be/' + videoId;

			console.log(`${videoTitle} - https://youtu.be/${videoId}`);
			return {
				url: url,
				title: videoTitle,
				uploader: uploader,
				length: length,
				views: views,
				likes: likes,
			};
		} else {
			console.log('No videos found!');
			return null;
		}
	} catch (error) {
		console.error('Error in searchYT():', error.message);
		return null;
	}
}
