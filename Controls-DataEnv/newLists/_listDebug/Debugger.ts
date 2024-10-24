/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import {
    asyncMiddlewareFactory,
    conditionalMiddlewareFactory,
    TAbstractAction,
} from 'Controls-DataEnv/dispatcher';
import { IOutput } from './debugger/output/IOutput';
import { ConsoleOutput } from './debugger/output/console';
import { SessionStorage } from './debugger/SessionStorage';
import { Session } from './debugger/Session';
import { setSender, PUBLIC_API_SENDER_NAME } from './debugger/utils/patchAction';
import { parseCookieValue } from './debugger/utils/parseCookieValue';
import { TDebugMode } from './debugger/types/TDebugMode';
import * as shouldLog from './debugger/utils/shouldLog';

/**
 * Отладчик цикла обновления списочного слайса.
 * Позволяет отлаживать сессию обновления одного или нескольких списочных слайсов на странице.
 * Выводит причину обновления, обновленные части состояния.
 * Также позволяет отследить цепочку распространения действий при обработке платформенной логики.
 *
 * --
 *
 * Работает от шаблонной строки вида:
 *
 * *** cookieValue="mode=modeValue | style=styleValue | slice=SliceName1,SliceName2" ***
 *
 * --
 *
 * Составные части строки:
 * | Название опции |      Тип     | Обязательная? | По-умолчанию  |
 * | -------------- | ------------ |-------------- | ------------- |
 * |    mode        | TDebugMode   |    Нет        | 'Changes'     |
 * |    style       | TOutputStyle |    Нет        | 'Significant' |
 * |    slice       | string       |    Нет        | ''            |
 *
 * @see TDebugMode
 * @see TOutputStyle
 * @private
 * @author Родионов Е.А.
 */
export class Debugger {
    private readonly _name: string;
    private readonly _output: IOutput;
    private readonly _debugMode: TDebugMode;
    private readonly _isEnabled: boolean = true;

    private _session?: Session;

    private _sessionNumber: number = 1;

    constructor(name: string, cookieValue: string, output?: IOutput) {
        this._name = name;
        const { debugMode, outputConfig, names } = parseCookieValue(cookieValue);
        this._debugMode = debugMode;
        this._output = output || new ConsoleOutput();
        this._output.setConfig(outputConfig);

        // Когда строго указывают какие слайсы отлаживать
        if (names.length && names.indexOf(this._name) === -1) {
            this._isEnabled = false;
        }
    }

    startSession(initialState: unknown): void {
        if (!this._isEnabled) {
            return;
        }
        if (this._session) {
            throw Error();
        }
        this._session = new Session(
            `[${this._name}] #${this._sessionNumber}`,
            this._output,
            this._debugMode
        );
        SessionStorage.getInstance().addSession(this._session);
        this._session.start(initialState);
    }

    endSession(resultState: unknown): void {
        if (!this._isEnabled) {
            return;
        }
        if (!this._session) {
            throw Error();
        }

        this._session.end(resultState);
        SessionStorage.getInstance().deleteSession(this._session);

        this._renderNew();
        this._sessionNumber++;
        this._session = undefined;
    }

    startDispatch(action: TAbstractAction) {
        if (!this._isEnabled) {
            return;
        }
        this._getSession().startDispatch(action);
    }
    endDispatch(action: TAbstractAction) {
        if (!this._isEnabled) {
            return;
        }
        this._getSession().endDispatch(action);
    }

    markPublicAction(action: TAbstractAction): void {
        if (!this._isEnabled) {
            return;
        }
        setSender(action, PUBLIC_API_SENDER_NAME);
    }

    markInnerAction(action: TAbstractAction, middlewareName: string): void {
        if (!this._isEnabled) {
            return;
        }
        setSender(action, prepareMiddlewareName(middlewareName));
    }

    innerSetState(
        prevState: object,
        nextState: object,
        _partialState: object,
        middlewareName: string
    ) {
        if (!this._isEnabled) {
            return;
        }
        this._getSession().innerSetState(
            prevState,
            nextState,
            prepareMiddlewareName(middlewareName)
        );
    }

    immediateApplyState(
        prevState: object,
        nextState: object,
        _partialState: object,
        middlewareName: string
    ) {
        if (!this._isEnabled) {
            return;
        }
        this._getSession().immediateApplyState(
            prevState,
            nextState,
            prepareMiddlewareName(middlewareName)
        );
    }

    logSliceChange(state: object): void {
        if (!this._isEnabled || !shouldLog.sliceChanged(this._debugMode)) {
            return;
        }

        const method = this._session ? this._output.add : this._output.renderItemImmediate;

        method.call(this._output, {
            type: 'groupCollapsed',
            args: [`Слайс [${this._name}] обновлен! Произошла перерисовка.`],
            status: 'warning',
        });

        method.call(this._output, {
            type: 'info',
            args: [state],
            status: 'additionalInfo',
        });

        method.call(this._output, {
            type: 'groupEnd',
        });
    }

    destroy() {
        if (this._session) {
            SessionStorage.getInstance().deleteSession(this._session);
            this._session.destroy();
            this._session = undefined;
        }
        this._output.destroy();
    }

    private _getSession(): Session {
        if (!this._session) {
            //todo
            throw Error('!!!');
        }
        return this._session;
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
