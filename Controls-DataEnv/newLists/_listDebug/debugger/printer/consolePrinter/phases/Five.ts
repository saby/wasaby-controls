import { _phase } from './_phase';
import { IFivePhaseMeta } from '../../../session/phases/Five';
import { IOutput } from 'Controls-DataEnv/newLists/_listDebug/debugger/output/IOutput';
import { IUpdateSessionMeta } from 'Controls-DataEnv/newLists/_listDebug/debugger/Session';
import { TDebugMode } from 'Controls-DataEnv/newLists/_listDebug/debugger/types/TDebugMode';

// В этой точке можно обрабатывать состояние,
// полученное от прикладника в результате обновления.
// Нельзя его менять по логике платформы, но можно поддержать исключения.
// Например, при неправильном корне можно вернуть прошлый, чтобы не было пустого экрана и т.п.
export const printPhaseFive = (
    output: IOutput,
    meta: IUpdateSessionMeta,
    debugMode: TDebugMode
) => {
    _phase<IFivePhaseMeta>(output, meta, debugMode, 4, 'Handle result state', (meta, printer) => {
        const loadedDeps = meta.phase.afterMeta?.loadedDeps || [];

        if (!meta.changes.length && !meta.dispatches.length && !loadedDeps.length) {
            output.add('info', [meta.title], 'additionalInfo');
        } else {
            output.add('groupCollapsed', [meta.title], 'default');

            output.add('groupCollapsed', [`Loaded modules: ${loadedDeps.length}`]);
            loadedDeps.forEach((dep) => {
                output.add('info', [dep]);
            });
            output.add('groupEnd');

            printer.printStateMutations();
            printer.printDispatches();

            output.add('groupEnd');
        }
    });
};
