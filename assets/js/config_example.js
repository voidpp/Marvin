
import Chromecast from './sources/Chromecast';
import Kodi from './sources/Kodi';

export default {
    sources: [{
        type: Chromecast,
        args: ['pyccws.lan', 8000],
    },{
        type: Kodi,
        args: ['kodi.lan', 9090, '/jsonrpc'],
    }]
}
