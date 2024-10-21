/**
 * @kaizen_zone eb394373-a8ed-4766-872d-8d931b215e0a
 */
import { getStore } from 'Application/Env';

interface IParams {
    // выполнить операцию с дефолтным контекстом
    ignoreContext?: boolean;
}

interface IStore {
    getState: () => Record<string, unknown>;
    get: (propertyName: string, params?: IParams) => unknown;
    onPropertyChanged: (
        propertyName: string,
        callback: (data: unknown) => void,
        isGlobal?: boolean,
        params?: IParams
    ) => string;
    unsubscribe: (id: string) => void;
    dispatch: (propertyName: string, data: unknown, isGlobal?: boolean, params?: IParams) => void;
    sendCommand: (commandName: string, params?: unknown) => void;
    declareCommand: (
        commandName: string,
        callback: (data: unknown) => void,
        isGlobal?: boolean
    ) => string;
    setGlobalContextName: (appContext: string) => void;
    getGlobalContextName: () => string;
}

interface IStateCallback {
    id: string;
    callbackFn: Function;
}

interface ICtxState {
    [propetyName: string]: {
        value: unknown;
        callbacks: IStateCallback[];
    };
}

interface IState {
    [ctxName: string]: ICtxState;
}

const ID_SEPARATOR = '--';
const APP_SEPARATOR = '@@';
const PAGE_STATE_FIELD = 'pageState';
const GLOBAL_CONTEXT_NAME = 'global';

/**
 * Синглтон, в который можно поместить данные, необходимые для использования контролов, не имеющих общего родителя.
 * Подробнее о работе читайте {@link /doc/platform/developmentapl/interface-development/application-configuration/create-page/store/ здесь}.
 * @public
 * @singleton
 */
class Store implements IStore {
    /**
     * Получение текущего стейта
     */
    getState(): ICtxState {
        return Store._getState()[Store._getContextName(false)] || {};
    }

    /**
     * Получение значения из текущего стейта
     * @param propertyName название поля в стейте
     * @param params параметры запроса
     */
    get<T = unknown>(propertyName: string, params?: IParams): T {
        const ignoreContext = params?.ignoreContext;
        const state = Store._getState()[Store._getContextName(false, ignoreContext)] || {};

        return (state.hasOwnProperty(propertyName)
            ? state[propertyName]
            : (Store._getState()[Store._getContextName(true, ignoreContext)] || {})[
                  propertyName
              ]) as unknown as T;
    }

    /**
     * Обновление значения в стейте
     * @param propertyName название поля в стейте
     * @param data данные
     * @param isGlobal
     * @param params параметры запроса
     */
    dispatch(
        propertyName: string,
        data: unknown,
        isGlobal?: boolean,
        params?: IParams
    ): void {
        const ignoreContext = params?.ignoreContext;
        this._setValue(propertyName, data, isGlobal, ignoreContext);
        this._notifySubscribers(propertyName, undefined, isGlobal, ignoreContext);
    }

    /**
     * Вызывает все обработчики для команды в текущем контексте
     * @param commandName
     */
    sendCommand(commandName: string, params?: unknown): void {
        const state = Store._getState()[Store._getContextName(false)] || {};

        return state.hasOwnProperty(commandName)
            ? this._notifySubscribers(commandName, params, false)
            : this._notifySubscribers(commandName, params, true);
    }

    /**
     * Подписка на изменение поля в стейте, при изменении поля вызовется колбэк с новым значением
     * @param propertyName
     * @param callback
     * @param isGlobal
     * @param params параметры запроса
     * @return {string} id колбэка, чтоб отписаться при уничтожении контрола
     */
    onPropertyChanged(
        propertyName: string,
        callback: (data: unknown) => void,
        isGlobal?: boolean,
        params?: IParams
    ): string {
        const ignoreContext = params?.ignoreContext;
        return this._addCallback(propertyName, callback, isGlobal, ignoreContext);
    }

    /**
     * Подписывается на команду в текущем контексте
     * @param commandName
     * @param callback
     * @param isGlobal
     * @return {string} id колбэка, чтоб отписаться при уничтожении контрола
     */
    declareCommand(
        commandName: string,
        callback: (data: unknown) => void,
        isGlobal?: boolean
    ): string {
        return this._addCallback(commandName, callback, isGlobal);
    }

    /**
     * Отписка колбэка по id
     * @param id
     */
    unsubscribe(id: string): void {
        this._removeCallback(id);
    }

    // обновляем название актуального контекста в зависимости от урла (сейчас это делает OnlineSbisRu/_router/Router)
    updateStoreContext(contextName: string, withoutContextDelete?: boolean): void {
        if (contextName !== Store._getActiveContext()) {
            if (
                Store._getState()[Store._getContextName(false)] &&
                Store._getActiveContext() !== GLOBAL_CONTEXT_NAME &&
                !withoutContextDelete
            ) {
                delete Store._getState()[Store._getContextName(false)];
            }
            Store._setActiveContext(contextName);

            this._notifySubscribers('_contextName', undefined, true, false);
        }
    }

    // изменение суффикса у контекста при открытии приложения на панели (SabyPage/applicationOpener)
    setGlobalContextName(appContext: string, removeCurrent?: boolean): void {
        // удаление текущего контекста при переключении глобального
        if (Store._appContext && removeCurrent) {
            delete Store._getState()[Store._getContextName(false)];
            delete Store._getState()[Store._getContextName(true)];
        }
        Store._appContext = appContext;
    }

    getGlobalContextName(): string {
        return Store._appContext;
    }

    private _setValue(
        propertyName: string,
        value: unknown,
        isGlobal?: boolean,
        ignoreContext?: boolean
    ): void {
        const state = Store._getState()[Store._getContextName(isGlobal, ignoreContext)] || {};

        if (!state.hasOwnProperty(propertyName)) {
            this._defineProperty(state, propertyName, isGlobal, ignoreContext);
        }
        state['_' + propertyName].value = value;

        Store._setState(state, Store._getContextName(isGlobal, ignoreContext));
    }

    // объявление поля в стейте
    private _defineProperty(
        state: ICtxState,
        propertyName: string,
        isGlobal?: boolean,
        ignoreContext?: boolean
    ): void {
        // приватное поле с _ в котором лежит значение и колбэки
        Object.defineProperty(state, '_' + propertyName, {
            value: { value: undefined, callbacks: [] },
            enumerable: false,
        });
        // сеттер и геттер для публичного поля
        Object.defineProperty(state, propertyName, {
            set() {
                // do nothing
            },
            get() {
                return this['_' + propertyName].value;
            },
            enumerable: true,
        });

        Store._setState(state, Store._getContextName(isGlobal, ignoreContext));
    }

    private _addCallback(
        propertyName: string,
        callbackFn: Function,
        isGlobal?: boolean,
        ignoreContext?: boolean
    ): string {
        const activeContext = Store._getContextName(isGlobal, ignoreContext);
        const state = Store._getState()[activeContext] || {};

        if (!state.hasOwnProperty(propertyName)) {
            this._defineProperty(state, propertyName, isGlobal, ignoreContext);
        }
        const currentCallbacks = state['_' + propertyName].callbacks;
        const newCallbackId =
            currentCallbacks.length > 0
                ? currentCallbacks[currentCallbacks.length - 1].id.split(ID_SEPARATOR)[2]
                : 0;
        const id = [activeContext, '_' + propertyName, +newCallbackId + 1].join(ID_SEPARATOR);
        currentCallbacks.push({ id, callbackFn });

        Store._setState(state, activeContext);

        return id;
    }

    private _removeCallback(id: string): void {
        const state = Store._getState();
        const [ctxName, propertyName]: string[] = id.split(ID_SEPARATOR);

        if (state && state[ctxName] && state[ctxName][propertyName]?.callbacks) {
            state[ctxName][propertyName].callbacks = state[ctxName][propertyName].callbacks.reduce(
                (acc, callbackObj) => {
                    if (callbackObj.id !== id) {
                        acc.push(callbackObj);
                    }
                    return acc;
                },
                []
            );

            Store._setState(state[ctxName], ctxName);
        }
    }

    private _notifySubscribers(
        propertyName: string,
        params?: unknown,
        isGlobal?: boolean,
        ignoreContext?: boolean
    ): void {
        const state = Store._getState()[Store._getContextName(isGlobal, ignoreContext)] || {};

        if (state['_' + propertyName]?.callbacks) {
            state['_' + propertyName].callbacks.forEach((callbackObject: IStateCallback) => {
                // прикладной params может придти только с команды, поэтому посылаем его если есть.
                return callbackObject.callbackFn(
                    params !== undefined ? params : state[propertyName]
                );
            });
        }
    }

    static _appContext: string = '';

    static _getState(): IState {
        return getStore<Record<string, IState>>(PAGE_STATE_FIELD).get('value') || {};
    }

    static _setState(state: ICtxState, context: string): void {
        const store = getStore<Record<string, IState>>(PAGE_STATE_FIELD).get('value') || {};
        store[context] = state;
        getStore<Record<string, IState>>(PAGE_STATE_FIELD).set('value', store);
    }

    static _getActiveContext(): string {
        return (
            getStore<Record<string, string>>(PAGE_STATE_FIELD).get('activeContext') ||
            GLOBAL_CONTEXT_NAME
        );
    }

    static _setActiveContext(context: string): string {
        const originalContext = (context || '').split(APP_SEPARATOR)[0];
        return getStore<Record<string, string>>(PAGE_STATE_FIELD).set(
            'activeContext',
            originalContext
        );
    }

    // получаем нужное имя контекста в зависимости от параметров
    static _getContextName(isGlobal?: boolean, ignoreContext?: boolean): string {
        return (
            (isGlobal ? GLOBAL_CONTEXT_NAME : Store._getActiveContext()) +
            (ignoreContext ? '' : Store._getAppContextName())
        );
    }

    static _getAppContextName(): string {
        return Store._appContext ? APP_SEPARATOR + Store._appContext : '';
    }
}

export default new Store();
