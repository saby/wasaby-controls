import { PromiseCanceledError } from 'Types/entity';
import { ISliceConstructorProps } from '../_dataFactory/interface/IDataFactory';

/**
 * Абстрактный Класс базового слайса.
 * Является дженериком. Принимает параметр State - тип состояния слайса
 * @remark
 * Полезные ссылки:
 * * Про реализацию своего собственного читайте в {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/create-context/ статье}.
 * @see Controls-ListEnv
 * @see Controls/dataFactory
 * @abstract
 * @public
 */

export default abstract class AbstractSlice<State = unknown> {
    readonly '[ISlice]': boolean = true;
    protected _onChange: Function;
    private _isExecuting: boolean = false;
    private _queue: Function[] = [];
    private _destroyed: boolean;
    private _stateForApply: Partial<State>;
    private _beforeApplyReject: Function;
    /**
     * Текущее состояние слайса.
     */
    state: State;

    constructor(props: ISliceConstructorProps<unknown, unknown>) {
        this.state = this._initState(props.loadResult, props.config);
        if (this.state instanceof Object) {
            Object.keys(this.state).forEach((propName) => {
                Object.defineProperty(this, propName, {
                    enumerable: false,
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
     * @param {unknown} loadResult Результат загрузки фабрики данных.
     * @param {Controls-DataEnv/_dataFactory/interface/IDataConfig} config Конфигурация фабрики даннных
     * @param extraValues
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
        if (this._beforeApplyReject) {
            this._beforeApplyReject(new PromiseCanceledError('slice has been destroyed'));
        }
        this._onChange = null;
        this._destroyed = true;
    }

    isDestroyed(): boolean {
        return this._destroyed;
    }
    /**
     * Метод, вызываемый перед применением состояния в слайсе.
     * Должен вернуть новое состояние или Promise с новым состоянием в результате
     * Если вернулся Promise, то все изменения, происходящие за время задержки будут применены после резолва.
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
    protected _beforeApplyState(nextState: State): State | Promise<State> {
        return nextState;
    }

    protected _applyState<State>(partialState: Partial<State>): void {
        this.state = {
            ...this.state,
            ...partialState,
        };
        this._onChange(this.state);
    }
    protected _onRejectBeforeApplyState(): void {
        // for overrides
    }

    protected _needRejectBeforeApply(
        partialState: Partial<State>,
        currentAppliedState?: Partial<State>
    ): boolean {
        return false;
    }

    protected _rejectBeforeApplyPromise(): void {
        this._onRejectBeforeApplyState();
        this._beforeApplyReject(new PromiseCanceledError(''));
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
     * @param {Partial<State>} partialState Новые значения состояния.
     * @example
     * <pre class="brush: js">
     *    import React from 'react';
     *    import {useSlice} from 'Controls-DataEnv/context';
     *
     *    export function MyComponent(props) {
     *        const mySlice = useSlice<MySlice>('mySliceId');
     *        mySlice.setState({
     *            prop1: 'value',
     *            prop2: 'value'
     *        });
     *    }
     * </pre>
     * @return {State | Promise<State>}
     */
    setState<State>(partialState: Partial<State>): void {
        if (this._destroyed) {
            return;
        }
        if (this._isExecuting) {
            let newState = partialState;
            if (
                this._beforeApplyReject &&
                this._needRejectBeforeApply(partialState, this._stateForApply)
            ) {
                newState = {
                    ...this._stateForApply,
                    ...partialState,
                };
                this._stateForApply = null;
                this._rejectBeforeApplyPromise();
            }
            this._queue.push(() => {
                this.setState(newState);
            });
            return;
        }
        const partialStateKeys = Object.keys(partialState);
        if (partialStateKeys.length === 0) {
            return;
        }
        const stateAreEqual = partialStateKeys.every((key) => {
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
            this._stateForApply = partialState;
            const beforeApplyPromise = new Promise((resolve, reject) => {
                this._beforeApplyReject = reject;
                return beforeApplyResult
                    .then((result) => resolve(result))
                    .catch((error) => reject(error));
            });
            beforeApplyPromise
                .then((result: State) => {
                    this._setState(result);
                })
                .catch((error) => {
                    if (!error.isCanceled) {
                        return Promise.reject(error);
                    }
                })
                .finally(() => {
                    this._beforeApplyReject = null;
                    this._isExecuting = false;
                    this._stateForApply = null;
                    this._executeQueueIfNeed();
                });
        } else if (typeof nextState === 'undefined') {
            throw new Error('Из обработчика _beforeApplyState не вернулось новое состояние');
        } else {
            this._setState(beforeApplyResult);
            this._isExecuting = false;
            this._executeQueueIfNeed();
        }
    }
}
