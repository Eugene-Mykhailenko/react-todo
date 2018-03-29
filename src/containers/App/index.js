// Core
import React, { Component } from 'react';
import { string } from 'prop-types';

// Components
import Scheduler from 'components/Scheduler';

const options = {
    api:   '',
    token: '',
};

export default class App extends Component {

    static childContextTypes = {
        api:   string.isRequired,
        token: string.isRequired,
    };

    getChildContext () {
        return {
            api:   options.api,
            token: options.token,
        };
    }

    render () {
        return (
            <Scheduler />
        );
    }
}
