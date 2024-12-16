import { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import { TDebugMode } from './types/TDebugMode';
import { IOutput } from './output/IOutput';
import * as shouldLog from './utils/shouldLog';
import * as MSG from './MessageDescriptors';
import { getSender, PUBLIC_API_SENDER_NAME } from './utils/patchAction';
import { DurationTimer } from './DurationTimer';

class Dispatch {
    private readonly _debugMode: TDebugMode;
    private readonly _output: IOutput;
    private _durationTimer?: DurationTimer;
    private _duration: number = -1;

    constructor(debugMode: TDebugMode, output: IOutput) {
        this._debugMode = debugMode;
        this._output = output;
    }

    start(action: TAbstractAction) {
        if (shouldLog.action(this._debugMode)) {
            const { style } = this._output.getConfig();
            const sender = getSender(action);
            const shouldLogTime = shouldLog.actionTime(this._debugMode);

            if (shouldLogTime) {
                this._durationTimer = DurationTimer.start();
            }
            if (sender === PUBLIC_API_SENDER_NAME) {
                this._output.add({
                    type: 'groupCollapsed',
                    args: [`${MSG.FIRST_ACTION_INFO(action.type, style)}`],
                    argsResolver: shouldLogTime
                        ? (args) => {
                              const result = [...args];

                              if (this._duration !== -1) {
                                  result.push(`${MSG.DURATION(this._duration, 'AllShort')}`);
                              }

                              return [result.join(' ')];
                          }
                        : undefined,
                });
            } else {
                this._output.add({
                    type: 'group',
                    args: [`${MSG.ACTION_INFO(action.type, sender, style)}`],
                    argsResolver: shouldLogTime
                        ? (args) => {
                              const result = [...args];

                              if (this._duration !== -1) {
                                  result.push(`${MSG.DURATION(this._duration, 'AllShort')}`);
                              }

                              return [result.join(' ')];
                          }
                        : undefined,
                });
            }
        }
    }

    stop(_action: TAbstractAction) {
        if (shouldLog.action(this._debugMode)) {
            if (this._durationTimer) {
                this._duration = this._durationTimer.stop();
                this._durationTimer = undefined;
            }
            this._output.add('groupEnd');
        }
    }

    static start(debugMode: TDebugMode, output: IOutput, action: TAbstractAction): Dispatch {
        const instance = new Dispatch(debugMode, output);
        instance.start(action);
        return instance;
    }
}

export class Dispatches {
    private readonly _debugMode: TDebugMode;
    private readonly _output: IOutput;

    private _dispatches: Dispatch[] = [];

    constructor(output: IOutput, debugMode: TDebugMode) {
        this._output = output;
        this._debugMode = debugMode;
    }

    push(action: TAbstractAction) {
        if (shouldLog.action(this._debugMode)) {
            this._dispatches.push(Dispatch.start(this._debugMode, this._output, action));
        }
    }

    pop(action: TAbstractAction) {
        if (shouldLog.action(this._debugMode)) {
            const inst = this._dispatches.pop();
            if (inst) {
                inst.stop(action);
            }
        }
    }

    destroy() {
        this._dispatches = [];
    }
}
