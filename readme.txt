Multi Channel Youtube Film Display System 

1. Channels listed in channels.js are read by getContent.js
2. For each channel videos from the last couple of days are readin by getVideos.js
3. Only videos with the word trailer, teaser or tvspot are pulled
4. Any videos with blu-ray, season or episode are discarded.
5. Videos are then displayed using pug rendered on express server.

Channel IDs
Channel.js uses channel IDs to skip the step of getting a channel id.
Read channel IDs manually using.
https://www.googleapis.com/youtube/v3/channels?part=snippet&forUsername=${username}&key=${key}`
