/**
 * @module data/channels
 * @description YouTube channel configuration for movie trailer sources.
 * Contains a curated list of major film studio and distributor channels
 * to monitor for new movie trailer releases.
 *
 * Each channel entry includes:
 * - name: Display name of the studio/distributor
 * - channelURL: YouTube channel URL slug (for reference)
 * - channelID: YouTube channel ID (used for API calls)
 *
 * @example
 * const channels = require('./data/channels');
 *
 * // Iterate over all channels
 * channels.forEach(channel => {
 *   console.log(`Fetching from ${channel.name}...`);
 *   const data = await fetchChannel(channel.channelID);
 * });
 *
 * // Get channel count
 * console.log(`Monitoring ${channels.length} channels`);
 */

/**
 * @typedef {Object} ChannelConfig
 * @property {string} name - Display name of the studio/distributor
 * @property {string} channelURL - YouTube channel URL slug
 * @property {string} channelID - YouTube channel ID for API calls
 */

/**
 * List of YouTube channels to monitor for movie trailers.
 * Includes major studios, streaming services, and independent distributors.
 *
 * @type {ChannelConfig[]}
 * @constant
 */
const channels = [
	{
		name: '20th Century Fox',
		channelURL: 'FoxMovies',
		channelID: 'UC2-BeLxzUBSs0uSrmzWhJuQ',
	},
	{
		name: 'Annapurna Pictures',
		channelURL: 'annapurnapictures',
		channelID: 'UCDRFfiYEWr_VSwGIrhY9k8g',
	},
	{
		name: 'Focus Features',
		channelURL: 'FocusFeatures',
		channelID: 'UCU4SM3j_9TNWaSu8KdGV50g',
	},
	{
		name: 'IFC Films',
		channelURL: 'IFCFilmsTube',
		channelID: 'UCOn923UnbV8H9zo_lO6ZCRw',
	},
	{
		name: 'Legendary',
		channelURL: 'legendarychannel',
		channelID: 'UCAVadSTSh382kte-fQHqMNw',
	},
	{
		name: 'Lionsgate Movies',
		channelURL: 'LionsgateLIVE',
		channelID: 'UCJ6nMHaJPZvsJ-HmUmj1SeA',
	},
	{
		name: 'Magnolia Pictures & Magnet Releasing',
		channelURL: 'MagnoliaPictures',
		channelID: 'UCneoi6WTgRjMh4otvpwzv8w',
	},
	{
		name: 'Marvel Entertainment',
		channelURL: 'MARVEL',
		channelID: 'UCvC4D8onUfXzvjTOM-dBfEA',
	},
	{
		name: 'MGM',
		channelURL: 'MGM',
		channelID: 'UCf5CjDJvsFvtVIhkfmKAwAA',
	},
	{
		name: 'Netflix',
		channelURL: 'NewOnNetflix',
		channelID: 'UCWOA1ZGywLbqmigxE4Qlvuw',
	},
	{
		name: 'Open Road Films',
		channelURL: 'openroadfilms',
		channelID: 'UClt5Bst8Ji05dZvTUdnO85g',
	},
	{
		name: 'Paramount Pictures',
		channelURL: 'Paramount',
		channelID: 'UCF9imwPMSGz4Vq1NiTWCC7g',
	},
	{
		name: 'Warner Bros. Pictures',
		channelURL: 'WarnerBrosPictures',
		channelID: 'UCjmJDM5pRKbUlVIzDYYWb6g',
	},
	{
		name: 'Disney',
		channelURL: 'disneysshows',
		channelID: 'UC_5niPa-d35gg88HaS7RrIw',
	},
	{
		name: 'Universal Pictures',
		channelURL: 'UniversalPictures',
		channelID: 'UCq0OueAsdxH6b8nyAspwViw',
	},
	{
		name: 'Disney Pixar',
		channelURL: 'DisneyPixar',
		channelID: 'UC_IRYSp4auq7hKLvziWVH6w',
	},
	{
		name: 'Sony Pictures Entertainment',
		channelURL: 'SonyPictures',
		channelID: 'UCz97F7dMxBNOfGYu3rx8aCw',
	},
	{
		name: 'STX Entertainment',
		channelURL: 'UCtlp8d4cZg2eMrVbq7vxg9w',
		channelID: 'UCtlp8d4cZg2eMrVbq7vxg9w',
	},
	{
		name: 'Bleeker Street',
		channelURL: 'UCafnP6JPjVq8AahYaThUelg',
		channelID: 'UCafnP6JPjVq8AahYaThUelg',
	},
	{
		name: 'Neon',
		channelURL: 'UCpy5dRhZd-JbZP4NsrnLt1w',
		channelID: 'UCpy5dRhZd-JbZP4NsrnLt1w',
	},
	{
		name: 'A24',
		channelURL: 'UCuPivVjnfNo4mb3Oog_frZg',
		channelID: 'UCuPivVjnfNo4mb3Oog_frZg',
	},
	{
		name: 'Dogwoof',
		channelURL: 'UCNruPWfg4GUGw3RcwaKtsXQ',
		channelID: 'UCNruPWfg4GUGw3RcwaKtsXQ',
	},
	{
		name: 'Universal UK',
		channelURL: 'UCQLBOKpgXrSj3nPU-YC3K9Q',
		channelID: 'UCQLBOKpgXrSj3nPU-YC3K9Q',
	},
	{
		name: 'Amazon Studios',
		channelURL: 'v',
		channelID: 'UCyouSlyNTfwX_pnGvlfIL3Q',
	},
	{
		name: 'Momentum Pictures',
		channelURL: 'UCElLRsuDWeYdOT3GgNZAUeQ',
		channelID: 'UCElLRsuDWeYdOT3GgNZAUeQ',
	},
	{
		name: 'Kinolorber',
		channelURL: 'kinolorber',
		channelID: 'UCtlPYzQ188v4gHQ5VyikNiw',
	},
	{
		name: 'Blumhouse',
		channelURL: 'BlumhouseProductions',
		channelID: 'UCCEfOHkckMXnoZQAjUZsMig',
	},
	{
		name: 'HBO',
		channelURL: 'UCVTQuK2CaWaTgSsoNkn5AiQ',
		channelID: 'UCVTQuK2CaWaTgSsoNkn5AiQ',
	},
	{
		name: 'Star Wars',
		channelURL: 'UCZGYJFUizSax-yElQaFDp5Q',
		channelID: 'UCZGYJFUizSax-yElQaFDp5Q',
	},
	{
		name: 'Gunpowder & Sky',
		channelURL: 'UCB9U0iEZ7mg4ysOkhFqzbAw',
		channelID: 'UCB9U0iEZ7mg4ysOkhFqzbAw',
	},
	{
		name: 'The Orchard Movies',
		channelURL: 'UCkML5g9N_azgHB7KQJ5fWLw',
		channelID: 'UCkML5g9N_azgHB7KQJ5fWLw',
	},
	{
		name: "MarVista Entertainment",
		channelURL: 'UC9p_Ow_Xnj7cR_xOwVU72-g',
		channelID: 'UC9p_Ow_Xnj7cR_xOwVU72-g',
	},
	{
		name: "RoadsideFlix",
		channelURL: "UCH45phx_o8pNt9PwbjxWhcA",
		channelID: "UCH45phx_o8pNt9PwbjxWhcA"
	},
	{
		name: "Regatta",
		channelURL: "UCkQCQhMF5hmR-X1Ij48u6BQ",
		channelID: "UCkQCQhMF5hmR-X1Ij48u6BQ",
	},
	{
		name: "Disney Movie Trailers",
		channelURL: "UCuaFvcY4MhZY3U43mMt1dYQ",
		channelID: "UCuaFvcY4MhZY3U43mMt1dYQ",
	},
	{
		name: "Illumination",
		channelURL: "UCq7OHvWO6Z3u-LztFdrcU-g",
		channelID: "UCq7OHvWO6Z3u-LztFdrcU-g",
	},
	{
		name: "Apple TV",
		channelURL: "UC1Myj674wRVXB9I4c6Hm5zA",
		channelID: "UC1Myj674wRVXB9I4c6Hm5zA",
	},
	{
		name: "Briarcliff Entertainment",
		channelURL: "UCfnXpb2MPBULONuZCyaKgmA",
		channelID: "UCfnXpb2MPBULONuZCyaKgmA",
	},
	{
		name: 'Cranked Up Films',
		channelURL: 'CrankedUpFilms',
		channelID: 'UCTdIZ-HAhxXqYTz7bQGftQA',
	},
	{
		name: 'AXISPACIFIC FILMWORKS',
		channelURL: 'UCTGQ6ucv6XMUSo98H6z2Zew',
		channelID: 'UCTGQ6ucv6XMUSo98H6z2Zew',
	},	
	{
		name: 'RLJE Films',
		channelURL: 'UC7QRIwDb8shSnZE8XB0lx4A',
		channelID: 'UC7QRIwDb8shSnZE8XB0lx4A',
	},	
	{
		name: 'Participant',
		channelURL: 'ParticipantMedia',
		channelID: 'UCaqPIODQHO1PsNLrfi-ejEA',
	},	
	{
		name: 'Film Movement',
		channelURL: 'UCk7fo5zbnRRGUu-FfvLIyag',
		channelID: 'UCk7fo5zbnRRGUu-FfvLIyag',
	},	
	{
		name: 'Sony Pictures Classics',
		channelURL: 'SonyPicturesClassics',
		channelID: 'UCruD_lL-5fmllpKMSL-yCyQ',
	},
	{
		name: 'Searchlight Pictures',
		channelURL: 'SearchlightPictures',
		channelID: 'UCor9rW6PgxSQ9vUPWQdnaYQ',
	},
	{
		name: 'Miramax',
		channelURL: 'miramax',
		channelID: 'UCaVwpbqM8dkhQvbL8XileAA',
	},
	{
		name: 'DreamWorks Animation',
		channelURL: 'Dreamworks',
		channelID: 'UCML7eumxGQaiFur_mNAebag',
	},
	{
		name: 'Hulu',
		channelURL: 'hulu',
		channelID: 'UCE5mQnNl8Q4H2qcv4ikaXeA',
	},
	{
		name: 'Studiocanal UK',
		channelURL: 'studiocanalUK',
		channelID: 'UCFSILgKCKo35QYGz8Kob51g',
	},
	{
		name: 'Shout! Studios',
		channelURL: 'ShoutStudios',
		channelID: 'UCpHaAKu74UHvcYCi2g_PvBQ',
	},
	{
		name: 'Vertical Entertainment',
		channelURL: 'VerticalEntertainment',
		channelID: 'UC_kr2hND7WcVRBV2AaazGrQ',
	},
	{
		name: 'Saban Films',
		channelURL: 'SabanFilms',
		channelID: 'UCkaUErzjD9UUM8D-loIm5vA',
	},
	{
		name: 'Well Go USA Entertainment',
		channelURL: 'WellGoUSAEntertainment',
		channelID: 'UCvE8nyjdQG0_rgx9u3oqadw',
	},
	{
		name: 'GKIDS Films',
		channelURL: 'GKIDSFilms',
		channelID: 'UCb9ME2w6Y_4jChUVlWdltVg',
	}

];

module.exports = channels;
