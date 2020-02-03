import {config} from './domain/application/config';

const cfg = {
    // URL: "ws://100.81.5.26:4000/websocket/tracker/websocket"
    URL: config.WEB_SOCKET_URL_WITH_CMS_BACKEND
}

const wsCmsBackendServiceSingletonClient = (function () {
    let instance: any;

    function createInstance() {
        const socket = new WebSocket(cfg.URL);
        return socket
    }

    return {
        getInstance: function () {
            // if (!instance) {
                instance = createInstance();
            // }
            return instance; 
        }
    };
})();

export default wsCmsBackendServiceSingletonClient;