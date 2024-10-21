import {
    asyncMiddlewareFactory,
    conditionalMiddlewareFactory,
    TAbstractAction,
} from 'Controls-DataEnv/dispatcher';
import { IOutput } from './debugger/output/IOutput';
import { ConsoleOutput } from './debugger/output/console';
import { Session } from './debugger/Session';
import { setSender, PUBLIC_API_SENDER_NAME } from './debugger/utils/patchAction';
import { TDebugMode } from './debugger/types/TDebugMode';

export class Debugger {
    private readonly _name: string;
    private readonly _output: IOutput;

    private _session?: Session;

    private _sessionNumber: number = 1;

    constructor(
        name: string,
        output: IOutput = new ConsoleOutput(),
        _debugMode: TDebugMode = 'All'
    ) {
        this._name = name;
        this._output = output;
    }

    getSession(): Session {
        if (!this._session) {
            throw Error();
        }
        return this._session;
    }

    startSession(initialState: unknown): void {
        if (this._session) {
            throw Error();
        }
        this._session = new Session(`[${this._name}] #${this._sessionNumber}`, this._output);
        this._session.start(initialState);
    }

    endSession(resultState: unknown): void {
        if (!this._session) {
            throw Error();
        }
        this._session.end(resultState);
        this._sessionNumber++;
        this._output.showNew();
        this._output.clearNew();
        this._session = undefined;
    }

    markPublicAction(action: TAbstractAction): void {
        setSender(action, PUBLIC_API_SENDER_NAME);
    }
    markInnerAction(action: TAbstractAction, middlewareName: string): void {
        setSender(action, prepareMiddlewareName(middlewareName));
    }
}

const prepareMiddlewareName = (name: string): string => {
    let result = name;
    ([conditionalMiddlewareFactory, asyncMiddlewareFactory] as const).forEach((f) => {
        result = f.undecorateName(result);
    });
    return result;
};
