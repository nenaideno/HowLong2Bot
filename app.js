"use strict";
import * as dotenv from 'dotenv';
import axios from "axios";
import howlongtobeat from "howlongtobeat";
import tmi from "tmi.js";
let hltbService = new howlongtobeat.HowLongToBeatService();
dotenv.config()


const instance = axios.create({
    baseURL: "https://api.twitch.tv/helix",
    withCredentials: true,
    'Content-Type': 'application/json',
    headers: {
        Authorization: process.env.auth,
        "Client-Id": process.env.client,
    }
})


const client = new tmi.Client({
    options: { debug: true },
    identity: {
        username: process.env.botName,
        password: process.env.access
    },
    channels: [process.env.channel1name, process.env.channel2name]
});

client.connect();

client.on("message", (channel, tags, message, self) => {

    if (self) return;

    switch (message.toLowerCase()) {
        case "!walkthrough":
            instance.get(`/channels?broadcaster_id=${process.env.channel2id}`).then(response => {
                response.data && hltbService.search(response.data.data[0].game_name).then(result => {
                    client.say(channel, `@${tags.username}, Approximate passage time of ${result[0].name} - ${result[0].gameplayMain} hours`);
                });
            })
            break;
        default:
            return
    }
});