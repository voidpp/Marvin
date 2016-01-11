
import {sprintf} from 'sprintf-js';

import WebSocketSourceBase from './WebSocketSourceBase';
import PlayerActionCreator from '../actions/PlayerActionCreator';
import TimeDelta from '../TimeDelta';

export class Kodi extends WebSocketSourceBase {
    constructor(host, port, path = '') {
        super(host, port, path);
        /**
         * At this time the KODI does not send notification when the subtitle/audio changed.
         * If the this.propertyLoopInterval is greater than 0, starts a loop for getting player
         * properties for detect sub/dub changes with this.propertyLoopInterval milliseconds.
         */
        this.propertyLoopInterval = 0;

        this.content = {
            id: null
        };

        this.player = {
            id: null,
        };

        this.handlers = {
            Player: {
                OnPause: (data) => {
                    PlayerActionCreator.pause();
                },
                OnPlay: (data) => {
                    let id = `${data.item.type}_${data.item.id}`;
                    PlayerActionCreator.play();
                    if (id != this.content.id)
                        this.fetchCurrentPlayingInfo();
                },
                OnSeek: (data) => {
                    PlayerActionCreator.seek(new TimeDelta(data.player.time), data.player.seekoffset);
                },
                OnStop: (data) => {
                    PlayerActionCreator.stop();
                    this.content.id = null;
                    this.stopPropertyLoop();
                },
                OnSpeedChanged: (data) => {
                    this.content.speed = data.player.speed;
                    PlayerActionCreator.changeContent(this.content);
                },
                GetActivePlayers: (data) => {
                    if (data.length)
                        this.send('Player.GetItem', {playerid: data[0].playerid});
                    this.player.id = data.length ? data[0].playerid : null;
                    if (this.player.id && this.propertyLoopInterval)
                        this.startPropertyLoop();
                },
                GetItem: (data) => {
                    this.content.id = `${data.item.type}_${data.item.id}`;
                    switch (data.item.type) {
                        case 'movie':
                            if ('id' in data.item) {
                                this.send('VideoLibrary.GetMovieDetails', {
                                    movieid: data.item.id,
                                    properties: ['fanart', 'thumbnail', 'title', 'tagline', 'year']
                                })
                            } else if ('label' in data.item) {
                                this.content.title = data.item.label;
                                this.getContentProps();
                            }
                            break;
                        case 'episode':
                            this.send('VideoLibrary.GetEpisodeDetails', {
                                episodeid: data.item.id,
                                properties: ['tvshowid', 'season', 'episode', 'title', 'streamdetails'],
                            });
                            break;
                    }
                },
                GetProperties: (data) => {
                    this.content = Object.assign(this.content, data);
                    this.content.time = new TimeDelta(data.time);
                    this.content.totaltime = new TimeDelta(data.totaltime);
                    PlayerActionCreator.changeContent(this.content);
                },
            },
            VideoLibrary: {
                GetMovieDetails: (data) => {
                    this.content.thumbnails = [this.formatImage(data.moviedetails.thumbnail)];
                    this.content.fanarts = [this.formatImage(data.moviedetails.fanart)];
                    this.content.title = data.moviedetails.title;
                    this.content.description = data.moviedetails.year;
                    this.getContentProps();
                },
                GetEpisodeDetails: (data) => {
                    this.content.title = data.episodedetails.title;
                    this.content.description = sprintf('%dx%02d', data.episodedetails.season, data.episodedetails.episode);
                    this.send('VideoLibrary.GetTVShowDetails', {
                        tvshowid: data.episodedetails.tvshowid,
                        properties: ['fanart', 'thumbnail', 'title']
                    });
                },
                GetTVShowDetails: (data) => {
                    this.content.fanarts = [this.formatImage(data.tvshowdetails.fanart).slice(0, -1)];
                    this.content.thumbnails = [this.formatImage(data.tvshowdetails.thumbnail).slice(0, -1)];
                    this.content.description = `${data.tvshowdetails.title} - ${this.content.description}`;
                    this.send('VideoLibrary.GetSeasons', {
                        tvshowid: data.tvshowdetails.tvshowid,
                        properties: ['fanart', 'thumbnail'],
                    });
                },
                GetSeasons: (data) => {
                    // for season thumbnails
                    this.getContentProps();
                },
            },
        };

        this.propIntervalId = null;
    }

    startPropertyLoop() {
        if (this.propIntervalId != null)
            return;
        this.propIntervalId = setInterval(this.getContentProps.bind(this), this.propertyLoopInterval);
    }

    stopPropertyLoop() {
        clearInterval(this.propIntervalId);
        this.propIntervalId = null;
    }

    formatImage(image) {
        return decodeURIComponent(image.slice(8));
    }

    getContentProps() {
        this.send('Player.GetProperties', {
            playerid: this.player.id,
            properties: ['percentage', 'time', 'totaltime', 'speed', 'currentsubtitle', 'currentaudiostream', 'subtitleenabled']
        })
    }

    pack(method, params = {}) {
        return {
            jsonrpc: "2.0",
            method: method,
            id: method,
            params: params,
        };
    }

    send(method, params = {}) {
        this.sendMessage(this.pack(method, params));
    }

    onOpen() {
        this.fetchCurrentPlayingInfo();
    }

    fetchCurrentPlayingInfo() {
        this.send('Player.GetActivePlayers');
    }

    processMessage(message) {
        if ('error' in message) {
            console.error('Error received from KODI:', message);
            return;
        } else
            console.debug('Processing KODI message:', message);

        let data = null;
        let id = null;

        if ('method' in message) {
            id = message.method;
            data = message.params.data;
        } else if ('id' in message) {
            id = message.id;
            data = message.result;
        }

        if (id === null)
            throw new Error('Unknown message');

        let [context, method] = id.split('.');

        if (!(context in this.handlers))
            return;

        let methods = this.handlers[context];

        if (!(method in methods))
            return;

        methods[method](data);
    }
};

export default Kodi;
