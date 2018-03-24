import React, { Component } from 'react';
import { string } from 'prop-types';

import Styles from './styles.scss';
import Chekbox from '../../theme/assets/Checkbox';
import Star from '../../theme/assets/Star';
import Edit from '../../theme/assets/Edit';
import Delete from '../../theme/assets/Delete';

export default class Task extends Component {
    static poropTypes = {
        taskText: string.isRequired,
    };

    render () {
        const { taskText } = this.props;

        return (

            <li className = { Styles.task }>
                <div>
                    <Chekbox
                        color1 = { '#3B8EF3' }
                        color2 = { '#fff' }
                    />
                    <span>{ taskText }</span>
                    {/*<input*/}
                        {/*type = 'text'*/}
                        {/*value = { taskText }*/}
                    {/*/>*/}
                </div>
                <div>
                    <Star color1 = { '#3B8EF3' } />
                    <Edit color1 = { '#3B8EF3' } />
                    <Delete color1 = { '#3B8EF3' } />
                </div>
            </li>
        );
    }
}
