import { IPhaseMeta } from '../../../session/phases';
import { IDispatchesMeta } from '../../../session/DispatchesStorage';
import { IUpdateSessionMeta } from '../../../Session';
import { IOutput } from '../../../output/IOutput';
import { TDebugMode } from '../../../types/TDebugMode';
import { printStateMutations } from '../printStateMutations';
import { printDispatches, hasAnyDispatchesToPrint } from '../printDispatches';
import { TChange } from '../../../session/ChangesStorage';

export const _phase = <T extends IPhaseMeta>(
    output: IOutput,
    meta: IUpdateSessionMeta,
    debugMode: TDebugMode,
    phaseIndex: number,
    phaseTitle: string,
    cb?: (
        meta: {
            title: string;
            phase: T;
            changes: TChange[];
            dispatches: IDispatchesMeta[];
        },
        printer: {
            printStateMutations: () => void;
            printDispatches: () => void;
        }
    ) => void
) => {
    const phase = meta.phases?.[phaseIndex] as T | undefined;
    if (!phase) {
        return;
    }
    const dis = meta.process?.filter((d) => d.phaseId === phase.id) || [];
    const changes = meta.changes?.filter((c) => c.phaseId === phase.id) || [];

    const status = !changes.length ? 'unchanged' : 'changed';

    const title = `Phase ${phaseIndex + 1}. ${phaseTitle} (${status}, ${phase.duration}ms).`;

    if (cb) {
        cb(
            {
                title,
                phase,
                changes,
                dispatches: dis,
            },
            {
                printStateMutations: () => {
                    if (changes.length) {
                        printStateMutations(output, changes, debugMode, false, 'hide');
                    }
                },
                printDispatches: () => {
                    if (hasAnyDispatchesToPrint(dis, debugMode)) {
                        printDispatches(output, dis, debugMode);
                    }
                },
            }
        );
    } else if (status === 'unchanged' && !hasAnyDispatchesToPrint(dis, debugMode)) {
        output.add('info', [title], 'additionalInfo');
    } else {
        output.add('groupCollapsed', [title], status === 'unchanged' ? 'warning3' : 'default');
        printStateMutations(output, changes, debugMode, false, 'hide');
        printDispatches(output, dis, debugMode);

        output.add('groupEnd');
    }
};
