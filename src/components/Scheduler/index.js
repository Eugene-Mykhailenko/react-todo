import React, { Component } from 'react';

import Styles from './styles.scss';
import Task from 'components/Task';
import Chekbox from '../../theme/assets/Checkbox';

export default class Scheduler extends Component {

    state = {
        taskList: [],
        taskText: '',
    };

    _handleInput = (e) => {
        this.setState(
            {
                taskText: e.target.value,
            }
        );
    };

    _createTask = (e) => {
        e.preventDefault();

        const {
            taskList,
            taskText,
        } = this.state;

        if (!taskText) {
            return;
        }

        this.setState(
            {
                taskList: [
                    ...taskList,
                    taskText
                ],
                taskText: '',
            }
        );
    };

    _removeTask = () => {

    };

    render () {

        const {
            taskList,
            taskText,
        } = this.state;

        const tasks = taskList.map((item) => {
            return (
                <Task taskText = { item } />
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
                        />
                    </header>

                    <section>
                        <form onSubmit = { this._createTask }>
                            <input
                                type = 'text'
                                value = { taskText }
                                onChange = { this._handleInput }
                                placeholder = 'Описание моей новой задачи'
                            />
                            <button>Добавить задачу</button>
                        </form>
                        <ul>
                            { tasks }
                        </ul>
                    </section>
                    <footer className = 'completed'>
                        <Chekbox
                            color1 = { '#000' }
                            color2 = { '#f5f5f5' }
                        />
                        <div>Все задачи выполнены</div>
                    </footer>
                </main>
            </div>
        )
    }
}
