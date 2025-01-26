import {
    asyncMiddlewareFactory,
    conditionalMiddlewareFactory,
    TAbstractAction,
} from 'Controls-DataEnv/dispatcher';
import { IOutput } from './debugger/output/IOutput';
import { ConsoleOutput } from './debugger/output/console';
import DebuggersStorage from './DebuggersStorage';
import { Session } from './debugger/Session';
import { setSender, setActionTrace, setPublicAsSender } from './debugger/utils/patchAction';
import { parseCookieValue } from './debugger/utils/parseCookieValue';
import { TDebugMode } from './debugger/types/TDebugMode';
import * as ErrorDescriptors from './ErrorDescriptors';
import * as MSG from './debugger/printer/consolePrinter/MSG';
import { SliceUpdate } from './debugger/SliceUpdate';
import { Printer } from './debugger/printer/ConsolePrinter';

/**
 * Отладчик списочного слайса.
 * Позволяет отлаживать жизненный цикл и обновления списочного слайса.
 * Выводит причину обновления, обновленные части состояния.
 * Также позволяет отследить цепочку распространения действий при обработке платформенной логики.
 * Поддерживает одновременное обновление нескольких слайсов на странице.
 * --
 *
 * Работает от шаблонной строки вида:
 *
 * *** cookieValue="mode=modeValue | style=styleValue | slice=SliceName1,SliceName2" ***
 *
 * --
 *
 * Составные части строки:
 * | Название опции |      Тип     | Обязательная? | По умолчанию  |
 * | -------------- | -------------- |-------------- | ------------- |
 * |    mode        |  TDebugMode    |    Нет        | 'Changes'     |
 * |    style       |  long | short  |    Нет        | 'long'        |
 * |    slice       |  string        |    Нет        | ''            |
 *
 * @see TDebugMode
 * @see TOutputStyle
 * @private
 * @author Родионов Е.А.
 */
export class Debugger {
    private readonly _name: string;
    private readonly _output: IOutput;
    private _debugMode: TDebugMode;
    private _isEnabled: boolean = true;

    private _rawCookieValue: string;

    private _session?: Session;
    private _sliceUpdates: SliceUpdate[] = [];

    private _sessionNumber: number = 1;
    private _isRejectedUpdateSession: boolean = false;

    constructor(name: string, cookieValue: string, output?: IOutput) {
        this._name = DebuggersStorage.getInstance().register(this, name);
        this._output = output || new ConsoleOutput();
        this.setCookieValue(cookieValue);
    }

    getName() {
        return this._name;
    }

    getOutput() {
        return this._output;
    }

    getSession(): Session {
        if (!this._session) {
            throw ErrorDescriptors.MISSING_SESSION();
        }
        return this._session;
    }

    onSliceInitialized(loadResult: unknown = {}, config: unknown = {}, state: unknown = {}) {
        this._output
            .add('groupCollapsed', ['Slice initialized'])
            .add('info', ['loadResult', { value: loadResult }])
            .add('info', ['config', { value: config }])
            .add('info', ['state', { value: state }])
            .add('groupEnd');
        this._renderNew();
    }

    endSessionPhase(arg: unknown): void {
        this.ifEnabled()?.getSession()?.endPhase(arg);
    }

    nextSessionPhase(arg: unknown): void {
        this.ifEnabled()?.getSession()?.nextPhase(arg);
    }

    setCookieValue(cookieValue: string) {
        if (this._rawCookieValue === cookieValue) {
            return;
        }

        this._rawCookieValue = cookieValue;
        const { debugMode, outputConfig, names } = parseCookieValue(this._rawCookieValue);
        this._debugMode = debugMode;
        this._output.setConfig(outputConfig);

        // Когда строго указывают какие слайсы отлаживать
        if (names.length && names.indexOf(this._name) === -1) {
            this._isEnabled = false;
            return;
        }
    }

    isEnabled() {
        return this._isEnabled;
    }

    ifEnabled(cb?: () => void): this | undefined {
        if (this.isEnabled()) {
            cb?.();
            return this;
        }
    }

    /**
     * Запускает отладку сессии обновления при ее начале.
     */
    onStartUpdateSession(initialState: unknown, actions: TAbstractAction[]): Session | undefined {
        if (!this.isEnabled()) {
            return;
        }
        if (this._session) {
            throw ErrorDescriptors.SESSION_ALREADY_EXISTS();
        }
        this._session = new Session(this._output);
        this._session.startSession(initialState, actions);
        return this._session;
    }

    /**
     * Завершает отладку сессии обновления при ее завершении.
     */
    onEndUpdateSession(resultState: unknown): void {
        if (this._isRejectedUpdateSession) {
            this._isRejectedUpdateSession = false;
            return;
        }
        const currentSession = this.ifEnabled()?.getSession();

        if (!currentSession) {
            return;
        }

        currentSession.endSession(resultState);

        Printer.print(
            this._name,
            String(this._sessionNumber),
            this._output,
            currentSession.getMeta(),
            this._debugMode
        );
        this._renderNew();
        this._sessionNumber++;
        this._session = undefined;
    }

    rejectUpdateSession() {
        const currentSession = this.ifEnabled()?.getSession();
        if (!currentSession) {
            return;
        }
        this._isRejectedUpdateSession = true;
        currentSession.destroy();
        this._session = undefined;
        this._output.add(
            'info',
            ['Сессия была отмененна. Удобное логирование отмены пока не реализовано. WIP...'],
            'warning'
        );
    }

    startDispatch(action: TAbstractAction) {
        this.ifEnabled()?.getSession().startDispatch(action);
    }

    endDispatch() {
        this.ifEnabled()?.getSession().endDispatch();
    }

    markPublicAction(action: TAbstractAction): void {
        this.ifEnabled(() => {
            setPublicAsSender(action);
        });
    }

    markInnerAction(action: TAbstractAction, middlewareName: string): void {
        this.ifEnabled(() => {
            setSender(action, prepareMiddlewareName(middlewareName));
        });
    }

    innerSetState(prevState: object, nextState: object, _partialState: object) {
        this.ifEnabled()?.getSession().innerSetState(prevState, nextState);
    }

    immediateSetState(prevState: object, nextState: object, _partialState: object) {
        this.ifEnabled()?.getSession().immediateSetState(prevState, nextState);
    }

    saveActionTrace(action: TAbstractAction, stack: string | undefined) {
        if (!stack) {
            return;
        }

        const trace = stack
            .split('\n')
            .map((i) => i.trim())
            .slice(1);

        for (let i = 0; i < trace.length; i++) {
            const replace = i === 0 ? '' : 'from ';
            const tab = i === 0 ? '' : '\t';
            trace[i] = `${tab}${trace[i].replace('at ', replace)}`;
        }

        setActionTrace(action, trace.join('\n'));
    }

    logSliceChangeStart(): void {
        // Создаем, запускаем и добавляем в хранилище новое обновление.
        // Присоединяем к сессии обновления, при ее наличии.
        // Ничего не делаем, если отладчик выключен.
        this.ifEnabled()?._sliceUpdates.push(new SliceUpdate(this._session).start());
    }

    logSliceChangeEnd(state: object): void {
        if (!this.isEnabled()) {
            return;
        }
        const upd = this._sliceUpdates[this._sliceUpdates.length - 1].end();

        if (!this._session) {
            this._output
                .renderItemImmediate({
                    type: 'groupCollapsed',
                    args: [
                        MSG.SLICE_UPDATED(
                            this._name,
                            upd.getMeta().duration,
                            this._output.getConfig().style
                        ),
                    ],
                    status: 'warning',
                })
                .renderItemImmediate({
                    type: 'info',
                    args: [state],
                    status: 'additionalInfo',
                })
                .renderItemImmediate({
                    type: 'groupEnd',
                });
        }
    }

    handleDispatchError(e: Error): void {
        this.ifEnabled()?.getSession()?.handleDispatchError(e);
    }

    destroy() {
        this._sliceUpdates.forEach((u) => u.destroy());
        this._sliceUpdates = [];

        if (this._session) {
            this._session.destroy();
            this._session = undefined;
        }
        DebuggersStorage.getInstance().unregister(this);
        this._output.destroy();
    }

    private _renderNew(): void {
        this._output.renderNew();
        this._output.clearNew();
    }
}

const prepareMiddlewareName = (name: string): string => {
    let result = name;
    ([conditionalMiddlewareFactory, asyncMiddlewareFactory] as const).forEach((f) => {
        result = f.undecorateName(result);
    });
    return result;
};
