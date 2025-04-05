import { IOutput } from '../output/IOutput';
import { TDebugMode } from '../types/TDebugMode';
import { IUpdateSessionMeta } from '../Session';
import * as MSG from './common/MSG';
import { printStateMutations as printStateMutationsUtil } from './consolePrinter/printStateMutations';
import { TChange } from 'Controls-DataEnv/newLists/_listDebug/debugger/session/ChangesStorage';
import { printPhaseOne } from './consolePrinter/phases/One';
import { printPhaseTwo } from './consolePrinter/phases/Two';
import { printPhaseThree } from './consolePrinter/phases/Three';
import { printPhaseFour } from './consolePrinter/phases/Four';
import { printPhaseFive } from './consolePrinter/phases/Five';
import { printPhaseSix } from './consolePrinter/phases/Six';
import { getActionTrace } from '../utils/patchAction';
import { TAbstractAction } from 'Controls-DataEnv/dispatcher';

/**
 * @private
 */
export class Printer {
    static print(
        sliceName: string,
        sessionId: string,
        output: IOutput,
        meta: IUpdateSessionMeta,
        debugMode: TDebugMode
    ) {
        const session = (cb: () => void) => {
            output.add('groupCollapsed', [
                MSG.START_UPDATE_SESSION(
                    sliceName,
                    sessionId,
                    meta.duration,
                    output.getConfig().style
                ),
            ]);
            cb();
            output.add('groupEnd');
        };

        const apiCalls = () => {
            if (meta.apiCalls?.length) {
                const getName = (action: TAbstractAction) => {
                    const type = String(action.type);
                    return type === 'Symbol(PublicSetStateSymbol)' ? 'setState' : type;
                };

                const printAction = (action: TAbstractAction) => {
                    output.add('info', [action.payload]);
                    output.add('info', [getActionTrace(action)]);
                };

                output.add('groupCollapsed', [
                    `API called: ${meta.apiCalls.map(getName).join(', ')}`,
                ]);

                if (meta.apiCalls.length > 1) {
                    meta.apiCalls.forEach((action) => {
                        output.add('groupCollapsed', [getName(action)]);
                        printAction(action);
                        output.add('groupEnd');
                    });
                } else {
                    printAction(meta.apiCalls[0]);
                }

                output.add('groupEnd');
            }
        };

        const stateMutations = (changes: TChange[] | undefined, mode?: 'hide' | 'warn') => {
            Printer.printStateMutations(output, changes, undefined, mode);
        };

        const process = (cb: () => void) => {
            output.add('groupCollapsed', ['Show process...']);
            cb();
            output.add('groupEnd');
        };

        const sliceUpdates = () => {
            const updatesMeta = meta.sliceUpdates;
            if (updatesMeta?.length && updatesMeta.length > 1) {
                output.add(
                    'info',
                    [
                        `Slice updates: ${updatesMeta.length} (${updatesMeta
                            .map((u) => `${u.duration}ms`)
                            .join(' / ')}).`,
                    ],
                    'warning3'
                );
            }
        };

        session(() => {
            apiCalls();
            stateMutations(meta.changes, 'warn');
            sliceUpdates();
            process(() => {
                printPhaseOne(output, meta, debugMode);
                printPhaseTwo(output, meta, debugMode);
                printPhaseThree(output, meta, debugMode);
                printPhaseFour(output, meta, debugMode);
                printPhaseFive(output, meta, debugMode);
                printPhaseSix(output, meta, debugMode);
            });
        });
    }

    static printStateMutations(
        ...[output, changes, showStatus, ifEmpty]: Parameters<typeof printStateMutationsUtil>
    ) {
        printStateMutationsUtil(output, changes, showStatus, ifEmpty);
    }
}
