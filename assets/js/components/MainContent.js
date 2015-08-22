
import React from 'react';
import {ComponentAsFactory, bind} from '../tools'

import PlayerStore from '../stores/PlayerStore';
import ActiveDisplay from './ActiveDisplay';
import InactiveDisplay from './InactiveDisplay';

class MainContent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            active: PlayerStore.isActive(),
            content: PlayerStore.getContent(),
        }

        bind(this, this.onChangePlayer);
    }

    componentDidMount() {
        PlayerStore.addChangeListener(this.onChangePlayer);
    }

    componentWillUnmount() {
        PlayerStore.removeChangeListener(this.onChangePlayer);
    }

    onChangePlayer() {
        this.setState({
            active: PlayerStore.isActive(),
            content: PlayerStore.getContent(),
        });
    }

    render() {
        return div({className: 'content'}, this.state.active ? ActiveDisplay(this.state.content) : InactiveDisplay());
    }
}

export default ComponentAsFactory(MainContent);
