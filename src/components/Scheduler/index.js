import React, { Component } from 'react';
import { string } from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Styles from './styles.scss';
import Task from 'components/Task';
import Checkbox from '../../theme/assets/Checkbox';


export default class Scheduler extends Component {

    static contextTypes = {
        api:   string.isRequired,
        token: string.isRequired,
    };

    state = {
        tasks:      [],
        searchText: '',
        message:    '',
    };

    componentDidMount () {
        this._fetchTasksAPI();
    }

    _changeGlobalStateTasks = (action) => {
        const {
            tasks,
        } = this.state;

        const {
            task,
            value,
        } = action;

        switch (action.type) {
            case 'ADD' :
                this._createTaskAPI(action.value);
                break;

            case 'DELETE' :
                this._removeTaskAPI(task.id);
                break;

            case 'EDIT' :
                this._editTaskAPI(task);
                break;

            case 'CHANGE_ALL' :
                const changeAll = tasks.map((e) => {
                    e.completed = value;
                    return e;
                });
                this._editTaskAllAPI(changeAll);
                break;
        }
    };

    _fetchTasksAPI = async () => {
        const { api, token } = this.context;

        fetch(api, {
            method:  'GET',
            headers: {
                'Content-Type':  'application/json',
                'Authorization': token,
            },
        }).then(response => {
            if (response.status !== 200) {
                throw new Error('create post err');
            }

            return response.json();
        }).then((res) => {
            res = res.data;
            this.setState(({ tasks }) => ({
                tasks: [...res, ...tasks],
            }));

        }).catch((err) => {
            console.log(err.message);
        });

    };

    _createTaskAPI = async (text) => {
        const {
            api,
            token,
        } = this.context;

        fetch(api, {
            method:  'POST',
            headers: {
                'Content-Type':  'application/json',
                'Authorization': token,
            },
            body: JSON.stringify({ message: text }),
        }).then(response => {
            if (response.status !== 200) {
                throw new Error('create post err');
            }

            return response.json();
        }).then((res) => {

            res = res.data;
            this.setState(({ tasks }) => ({
                tasks: [res, ...tasks],
            }));

        }).catch((err) => {
            console.log(err.message);
        });

    };

    _removeTaskAPI = async (id) => {
        const {
            api,
            token,
        } = this.context;

        fetch(`${api}/${id}`, {
            method:  'DELETE',
            headers: {
                'Authorization': token,
            },

        }).then(() => {
            this._removeTaskState(id);
        }).catch((err) => {
            console.log(err.message);
        });

    };

    _createTask = (event) => {

        event.preventDefault();

        const {
            message
        } = this.state;

        if (!message.trim()) {
            return false;
        }

        const action = {
            type:  'ADD',
            value: message,
        };

        this.setState(() => ({
            message: '',
        }));

        this._changeGlobalStateTasks(action);
    };

    _removeTaskState = (id) => {
        const {
            tasks,
        } = this.state;

        this.setState({
            tasks: tasks.filter((e) => e.id !== id),
        });
    };

    _editTaskAPI = async (editedTask) => {

        const {
            api,
            token,
        } = this.context;

        fetch(api, {
            method:  'PUT',
            headers: {
                'Content-Type':  'application/json',
                'Authorization': token,
            },

            body: JSON.stringify([editedTask]),
        }).then(response => {
            if (response.status !== 200) {
                throw new Error('create post err');
            }

            return response.json();
        }).then((res) => {
            res = res.data;

            this._removeTaskState(editedTask.id);

            this.setState(({ tasks }) => ({
                tasks: [...res, ...tasks],
            }));

        }).catch((err) => {
            console.log(err.message);
        });
    };

    _editTaskAllAPI = async (editedTask) => {

        const {
            api,
            token,
        } = this.context;

        fetch(api, {
            method:  'PUT',
            headers: {
                'Content-Type':  'application/json',
                'Authorization': token,
            },
            body: JSON.stringify(editedTask),
        }).then(response => {
            if (response.status !== 200) {
                throw new Error('create post err');
            }

            return response.json();
        }).then((res) => {
            res = res.data;
            this.setState({
                tasks: res,
            });
        }).catch((err) => {
            console.log(err.message);
        });
    };

    _filterSearch = (task) => {
        return task.filter((e) => e.message.toLocaleLowerCase().includes(this.state.searchText.toLocaleLowerCase()));
    };

    _filterTasks = (tasks) => {
        return tasks.sort(((a, b) => {

            let dateA = a.modified || a.created;
            let dateB = b.modified || b.created;

            dateA = new Date(dateA);
            dateB = new Date(dateB);

            if ((a.favorite || b.favorite) && (!a.completed && !b.completed)) {

                if (a.favorite && b.favorite) return dateB > dateA ? 1 : -1;
                if (a.favorite && !b.favorite) return -1;
                if (!a.favorite && b.favorite) return 1;

            } else if (a.completed || b.completed) {

                if (a.completed && b.completed) {

                    if (!a.favorite && b.favorite) return 1;
                    if (a.favorite && !b.favorite) return -1;
                    return dateB > dateA ? 1 : -1;
                }
                if (a.completed && !b.completed) return 1;
                if (!a.completed && b.completed) return -1;

            } else {
                return dateB > dateA ? 1 : -1;
            }

        }))
    };

    _setSearchText = (e) => {
        this.setState({
            searchText: e.target.value,
        });
    };

    _setMessage = (event) => {
        const message = event.target.value;

        if (message.length > 46) {
            return false;
        }

        this.setState(() => ({
            message,
        }));
    };

    _targetCheckbox = () => {
        const {
            tasks,
        } = this.state;

        const action = {
            type:  'CHANGE_ALL',
            value: !(this.countCompletedTasks === tasks.length),
        };

        this._changeGlobalStateTasks(action);

    };

    render () {
        const {
            searchText,
            message,
        } = this.state;

        let {
            tasks: tasksData,
        } = this.state;

        tasksData = this._filterTasks(tasksData);
        tasksData = this._filterSearch(tasksData);

        let countCompletedTasks = 0;

        let tasks = tasksData.map(task => {
            if (task.completed) {
                countCompletedTasks++;
            }

            return (
                <CSSTransition
                    classNames = { {
                        enter:       Styles.taskInStart,
                        enterActive: Styles.taskInEnd,
                        exit:        Styles.taskOutStart,
                        exitActive:  Styles.taskOutEnd,

                    } }
                    key = { task.id }
                    timeout = { 700 }>
                    <Task
                        changeGlobalStateTasks = { this._changeGlobalStateTasks }
                        key = { task.id }
                        task = { task }

                    />
                </CSSTransition>
            );
        });

        return (
            <div className = { Styles.scheduler }>
                <main>
                    <header>
                        <h1>Планировщик задач</h1>
                        <input
                            placeholder = 'Поиск'
                            type = 'text'
                            value = { searchText }
                            onChange = { this._setSearchText }
                        />
                    </header>

                    <section>
                        <form>
                            <div>
                                <input
                                    placeholder = 'Описание моей новой задачи'
                                    type = 'text'
                                    value = { message }
                                    onChange = { this._setMessage }
                                />
                            </div>
                            <button
                                disabled = { !message.trim() }
                                onClick = { this._createTask } >
                                Добавить задачу
                            </button>
                        </form>

                        <ul>
                            <TransitionGroup>
                                { tasks }
                            </TransitionGroup>
                        </ul>
                    </section>
                    <footer>
                        <Checkbox
                            checked = { countCompletedTasks === tasks.length }
                            color1 = '#000'
                            color2 = '#f5f5f5'
                            onClick = { this._targetCheckbox }
                        />
                        <div>Все задачи выполнены</div>
                    </footer>
                </main>
            </div>
        );
    }
}
