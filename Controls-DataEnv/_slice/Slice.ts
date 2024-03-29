export interface ISliceProps {
    onChange: Function;
    loadResult: unknown;
    config: unknown;
}

interface IAsyncChange<T> {
    state: Partial<T>;
    done: boolean;
}

/**
 * Абстрактный Класс базового слайса.
 * Является дженериком. Принимает параметр State - тип состояния слайса
 * @abstract
 * @class Controls-DataEnv/_slice/Slice
 * @public
 */

export default abstract class Slice<State = object> {
    readonly '[ISlice]': boolean = true;
    private readonly _onChange: Function;
    private _isExecuting: boolean = false;
    private _queue: Function[] = [];
    /**
     * Текущее состояние слайса.
     */
    state: State;

    constructor(props: ISliceProps) {
        this.state = this._initState(props.loadResult, props.config);
        if (this.state instanceof Object) {
            Object.keys(this.state).forEach((propName) => {
                Object.defineProperty(this, propName, {
                    get(): any {
                        return this.state[propName];
                    },
                });
            });
        }
        this._onChange = props.onChange;
    }

    /**
     * Метод инициализации начального состояния слайса.
     * @function Controls-DataEnv/_slice/Slice#_initState
     * @param {unknown} loadResult Результат загрузки фабрики данных.
     * @param {Controls-DataEnv/_dataFactory/interface/IDataConfig} config Конфигурация фабрики даннных
     * @protected
     * @abstract
     * @example
     * <pre class="brush: js">
     *    import {Slice} from 'Controls-DataEnv/Slice';
     *
     *    interface IMySliceState {
     *        propFromData: number;
     *        propFromConfig: number;
     *    }
     *
     *    export default class MySlice extends Slice<IMySliceState> {
     *        protected _initState(loadResult: IMyLoadResult, config: IMyFactoryConfig): IMySliceState {
     *            return {
     *                propFromData: loadResult.prop1,
     *                propFromConfig: config.prop2
     *            };
     *        }
     *    }
     * </pre>
     * @return {State}
     */
    protected abstract _initState(loadResult: unknown, config: unknown): State;
    /**
     * Метод, вызываемый при разрушении экземпляра слайса.
     * Может быть использован для отписок от различных хранилищ, шин событий и т.п.
     * @function Controls-DataEnv/_slice/Slice#destroy
     * @example
     * <pre class="brush: js">
     *    import {Slice} from 'Controls-DataEnv/Slice';
     *
     *    interface IMySliceState {
     *        propFromData: number;
     *        propFromConfig: number;
     *    }
     *
     *    export default class MySlice extends Slice<IMySliceState> {
     *          constructor(loadResult, config) {
     *              super(this);
     *              EventBusChannel.subscribe('event', this._eventHandler);
     *          }
     *
     *          destroy(): void {
     *              EventBusChannel.unsubscribe('event', this._eventHandler);
     *          }
     *    }
     * </pre>
     * @return {State}
     */
    destroy(): void {
        this._asyncChanges = null;
    }
    /**
     * Метод, вызываемый перед применением состояния в слайсе.
     * Должен вернуть новое состояние или Promise с новым состоянием в результате
     * Если вернулся Promise, то все изменения, происходящие за время задержки будут применены после резолва.
     * @function Controls-DataEnv/_slice/Slice#_beforeApplyState
     * @param {State} nextState следующее состояние слайса.
     * @protected
     * @example
     * <pre class="brush: js">
     *    import {Slice} from 'Controls-DataEnv/Slice';
     *
     *    interface IMySliceState {
     *        propFromData: number;
     *        propFromConfig: number;
     *    }
     *
     *    export default class MySlice extends Slice<IMySliceState> {
     *          _beforeApplyState(nextState: IMySliceState): IMySliceState {
     *              if (this.state.propFromData !== nextState.propFromData) {
     *                  nextState.propFromConfig++;
     *              }
     *              return nextState;
     *          }
     *    }
     * </pre>
     * @return {State | Promise<State>}
     */
    protected _beforeApplyState<State>(
        nextState: State
    ): State | Promise<State> {
        return nextState;
    }

    protected _applyState<State>(partialState: Partial<State>): void {
        this.state = {
            ...this.state,
            ...partialState,
        };
        this._onChange(this.state);
    }

    private _executeQueueIfNeed(): void {
        if (this._queue.length) {
            const fn = this._queue.shift();
            fn();
        }
    }

    private _setState(state: State): void {
        this.state = state;
        this._onChange(this.state);
    }
    /**
     * Метод для изменения состояния в слайсе.
     * @function Controls-DataEnv/_slice/Slice#setState
     * @param {Partial<State>} partialState Новые значения состояния.
     * @example
     * <pre class="brush: js">
     *    import React from 'react';
     *    import {DataContext} from 'Controls-DataEnv/context';
     *
     *    export function MyComponent(props) {
     *        const context = React.useContext(DataContext);
     *        context.mySlice.setState({
     *            prop1: 'value',
     *            prop2: 'value'
     *        });
     *    }
     * </pre>
     * @return {State | Promise<State>}
     */
    setState<State>(partialState: Partial<State>): void {
        if (this._isExecuting) {
            this._queue.push(() => {
                this.setState(partialState);
            });
            return;
        }
        const stateAreEqual = Object.keys(partialState).every((key) => {
            return this.state[key] === partialState[key];
        });
        if (stateAreEqual) {
            this._isExecuting = false;
            this._executeQueueIfNeed();
            return;
        }
        this._isExecuting = true;
        const nextState = {
            ...this.state,
            ...partialState,
        };
        const beforeApplyResult = this._beforeApplyState(nextState);

        if (beforeApplyResult instanceof Promise) {
            beforeApplyResult
                .then((result) => {
                    this._setState(result);
                })
                .finally(() => {
                    this._isExecuting = false;
                    this._executeQueueIfNeed();
                });
        } else if (typeof nextState === 'undefined') {
            throw new Error(
                'Из обработчика _beforeApplyState не вернулось новое состояние'
            );
        } else {
            this._setState(beforeApplyResult);
            this._isExecuting = false;
            this._executeQueueIfNeed();
        }
    }
}
