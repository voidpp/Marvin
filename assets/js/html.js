import React from 'react';

import {freeParamize} from './tools';

for (let name in React.DOM) {
    global[name] = function(...args) {
        let {params, contents} = freeParamize(args);
        return React.DOM[name](params, ...contents);
    };
}
