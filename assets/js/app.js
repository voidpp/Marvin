
import 'babelify/polyfill';
import './html';

import React from 'react';
import MainContent from './components/MainContent';

import config from './config';

let sources = [];

config.sources.forEach((source) => {
    sources.push(new source.type(...source.args));
})

window.onbeforeunload = () => {
    sources.forEach((s) => {
        s.close();
    })
}

React.render(MainContent(), document.body);
