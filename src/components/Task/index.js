import React, { Component } from 'react';

import Styles from './styles.scss';
import Checkbox from '../../theme/assets/Checkbox';
import Star from '../../theme/assets/Star';
import Edit from '../../theme/assets/Edit';
import Delete from '../../theme/assets/Delete';

export default class Task extends Component {

    state = {
        isEdit:          false,
        editTaskMessage: '',
    };

    componentDidMount () {
        document.addEventListener('keydown', this._escFunction, false);

    }
    componentWillReceiveProps () {
        this._resetState();
    }

    componentWillUnmount () {
        document.removeEventListener('keydown', this._escFunction, false);

    }

    _changeGlobalStateTasks = (type) => {

        const {
            changeGlobalStateTasks,
            task,
        } = this.props;

        const action = {
            type,
            task,
        };

        changeGlobalStateTasks(action);
    };

    _handleEditFavorite = () => {

        const { task } = this.props;

        Object.assign(task, {
            favorite: !task.favorite,
        });

        this._changeGlobalStateTasks('EDIT');
    };

    _handleEditField = () => {
        const {
            isEdit,
            editTaskMessage,
        } = this.state;

        const {
            message,
        } = this.props.task;

        if (this.props.completed) {
            return false;
        }

        if (isEdit && editTaskMessage !== message) {

            const {
                task,
            } = this.props;

            Object.assign(task, { message: editTaskMessage.trim() ? editTaskMessage : task.message });

            this._changeGlobalStateTasks('EDIT');

        } else {

            this.setState({
                editTaskMessage: message,
            });
        }

        this.setState({
            isEdit: !this.state.isEdit,
        });

    };

    _handleEditCompleted = () => {

        const { task } = this.props;

        Object.assign(task, {
            completed: !task.completed,
        });
        this._changeGlobalStateTasks('EDIT');
    };

    _editTaskMessage = (event) => {

        const value = event.target.value;

        if (value.length > 46) {
            return false;
        }

        this.setState({
            editTaskMessage: value,
        });

    };

    _resetState = () => {
        this.setState({
            editTaskMessage: '',
            isEdit:  false,
        });
    };

    _escFunction = (event) => {
        if (event.keyCode === 27) {
            this._resetState();
        }
    };

    render () {
        const {
            completed,
            favorite,
            message,
        } = this.props.task;

        const {
            isEdit,
            editTaskMessage,
        } = this.state;

        return (

            <li className = { completed ? `${Styles.task} ${Styles.completed}` : Styles.task }>
                <div>
                    <Checkbox
                        checked = { completed }
                        color1 = '#3B8EF3'
                        color2 = '#fff'
                        onClick = { () => this._handleEditCompleted() }
                    />

                    {
                        isEdit
                            ?
                            <input
                                placeholder = 'введите текст'
                                type = 'text'
                                autoFocus
                                value = { editTaskMessage }
                                onChange = { this._editTaskMessage }
                            />
                            :
                            <span>{ message }</span>
                    }
                </div>
                <div>
                    <Star
                        checked = { favorite }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        onClick = { () => this._handleEditFavorite() }
                    />
                    <Edit
                        color1 = '#3B8EF3'
                        color2 = { isEdit ? '#3B8EF3' : '#000' }
                        onClick = { this._handleEditField }
                    />
                    <Delete
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        onClick = { () => this._changeGlobalStateTasks('DELETE') }
                    />
                </div>
            </li>
        );
    }
}
