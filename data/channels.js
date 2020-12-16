//jshint esversion:6
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
	// {
	// 	name: 'The Weinstein Company',
	// 	channelURL: 'TheWeinsteinCompany',
	// 	channelID: 'UCdIRIVIc9JMnWzkKFettP8g',
	// },
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
		name: 'Sony Pictures Classic',
		channelURL: 'SonyPicturesClassics',
		channelID: 'UCruD_lL-5fmllpKMSL-yCyQ',
	},
	{
		name: 'Blumhouse',
		channelURL: 'BlumhouseProductions',
		channelID: 'UCCEfOHkckMXnoZQAjUZsMig',
	},
	{
		name: 'Momentum Pictures',
		channelURL: 'UCElLRsuDWeYdOT3GgNZAUeQ',
		channelID: 'UCElLRsuDWeYdOT3GgNZAUeQ',
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
	}
];
// lets export all these channellsss
module.exports = channels;
