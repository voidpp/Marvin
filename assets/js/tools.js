
import React from 'react';

export function freeParamize(args) {
    let params = {};
    let contents = [];
    args.forEach(arg => {
        if (arg === null)
            return;
        if (typeof arg == 'object') {
            if ('_isReactElement' in arg)
                contents.push(arg);
            else
                Object.assign(params, arg);
        } else
            contents.push(arg);
    });

    return {
        params: params,
        contents: contents,
    };
}

export function ComponentAsFactory(name) {
    return function(...args) {
        let {params, contents} = freeParamize(args);
        return React.createElement(name, params, ...contents);
    };
}

export function bind(context, ...functions) {
    for(let a = 0; a < functions.length; a++) {
        context[functions[a].name] = functions[a].bind(context);
    }
}
