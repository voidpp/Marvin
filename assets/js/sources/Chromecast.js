
import WebSocketSourceBase from './WebSocketSourceBase';
import PlayerActionCreator from '../actions/PlayerActionCreator';
import TimeDelta from '../TimeDelta';

export class Chromecast extends WebSocketSourceBase {

    constructor(host, port, path = '') {
        super(host, port, path);
        this.contentId = null;
    }

    formatContent(data) {
        let thumbs = [];
        if ('images' in data.media_metadata) {
            for (let img of data.media_metadata.images)
                thumbs.push(img.url);
        }
        return {
            time: new TimeDelta(data.current_time * 1000),
            totaltime: new TimeDelta(data.duration * 1000),
            title: data.media_metadata.title,
            thumbnails: thumbs,
            fanarts: thumbs,
            description: data.content_type,
            speed: data.player_state == 'PLAYING' ? 1 : 0,
            percentage: data.current_time / data.duration * 100
        };
    }

    processMediaStatus(data) {
        if (data.content_id !== this.contentId) {
            PlayerActionCreator.changeContent(this.formatContent(data));
            return;
        }

        switch (data.player_state) {
            case 'PLAYING':
                PlayerActionCreator.play();
                break;

            case 'PAUSED':
                PlayerActionCreator.pause();
                break;

            case 'UNKNOWN':
                PlayerActionCreator.stop();
                break;
        }

    }

    processMessage(message) {
        console.debug('Processing Chromecast message:', message);
        switch(message.type) {
            case 'new_media_status':
                this.processMediaStatus(message.data);
                break;
        }
    }
};

export default Chromecast;
