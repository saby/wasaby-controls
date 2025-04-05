import { loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';
import { cookie } from 'Application/Env';
import type { IOutput, IOutputItem, TChangeMapper } from 'Controls-DataEnv/listDebug';
import { wrap, Wrapper } from 'Controls-DataEnvUnit/newLists/TestEnv/rawSnapshotSerializer';
import { IListState } from 'Controls-DataEnv/list';

const DEBUG_LIB = 'Controls-DataEnv/listDebug';

export const loadDebug = async () => {
    await loadAsync<typeof import('Controls-DataEnv/listDebug')>(DEBUG_LIB);
    cookie.set('ListInteractorDebug', 'mode="Dev"');
};

const formatArg = (arg: unknown): string | undefined => {
    if (typeof arg === 'object') {
        return JSON.stringify(arg);
    }

    if (typeof arg === 'undefined') {
        return undefined;
    }

    return arg.toString();
};

const formatOutputString = ({ args: [key, ...args] }: IOutputItem): Wrapper => {
    const values = args.map(formatArg).join(' ');

    return wrap(`${key}: ${values}`);
};

export const getChanges = <TState extends IListState = IListState>(
    storeId: string,
    changeMapper?: TChangeMapper<TState>
) => {
    const { getDebuggers, AbstractOutput, SnapshotsPrinter } =
        loadSync<typeof import('Controls-DataEnv/listDebug')>(DEBUG_LIB);

    const debuggerInst = getDebuggers().get(storeId);
    if (!debuggerInst) {
        throw Error('Missing debugger instance for storeId=' + storeId + '!');
    }

    class Output extends AbstractOutput {
        protected _renderItems(): void {}

        renderItemImmediate(): IOutput {
            return this;
        }
    }

    const customOutput = new Output();

    const result: Wrapper[][] = [];

    debuggerInst.getHistory().forEach((sessionMeta) => {
        if (!sessionMeta.changes?.length) {
            result.push([wrap('Изменений не произошло')]);
            return;
        }

        SnapshotsPrinter.printStateMutations<TState>(
            customOutput,
            sessionMeta.changes,
            'show',
            changeMapper
        );

        result.push(customOutput.getAll().map(formatOutputString));
        customOutput.clearAll();
    });

    return result;
};
