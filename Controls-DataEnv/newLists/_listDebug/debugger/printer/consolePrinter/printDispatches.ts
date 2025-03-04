import { IOutput } from 'Controls-DataEnv/newLists/_listDebug/debugger/output/IOutput';
import { IDispatchesMeta } from 'Controls-DataEnv/newLists/_listDebug/debugger/session/DispatchesStorage';
import { TDebugMode } from 'Controls-DataEnv/newLists/_listDebug/debugger/types/TDebugMode';
import * as shouldLog from 'Controls-DataEnv/newLists/_listDebug/debugger/utils/shouldLog';
import {
    getSender,
    isPublicSender,
} from 'Controls-DataEnv/newLists/_listDebug/debugger/utils/patchAction';
import * as MSG from './MSG';
import { printChanges, Prefix } from './printStateMutations';

export function hasAnyDispatchesToPrint(metas: IDispatchesMeta[], debugMode: TDebugMode): boolean {
    return shouldLog.action(debugMode) && !!metas?.length;
}

export function printDispatches(
    output: IOutput,
    metas: IDispatchesMeta[],
    debugMode: TDebugMode
): void {
    if (hasAnyDispatchesToPrint(metas, debugMode)) {
        metas.forEach((meta) => {
            printDispatch(output, meta, debugMode);
        });
    }
}

function hasChangesRecursive(meta: IDispatchesMeta): boolean {
    return (
        !!meta.changes.length || (!!meta.children.length && meta.children.some(hasChangesRecursive))
    );
}

function printDispatch(output: IOutput, meta: IDispatchesMeta, debugMode: TDebugMode) {
    if (!meta.action) {
        // TODO
        throw Error('????');
    }

    const { style } = output.getConfig();
    const isPublic = meta.action && isPublicSender(meta.action);
    const sender = meta.action && getSender(meta.action);

    const hasChanges = hasChangesRecursive(meta);

    const addTime = (msg: string): string => {
        if (shouldLog.actionTime(debugMode) && typeof meta.duration !== 'undefined') {
            return msg + ` ${MSG.DURATION(meta.duration, style)}`;
        }
        return msg;
    };

    const type =
        !hasChanges && !meta.children.length
            ? 'info'
            : !hasChanges || isPublic
            ? 'groupCollapsed'
            : 'group';

    const status = !hasChanges ? 'additionalInfo' : 'default';

    if (isPublic) {
        output.add({
            type,
            args: [addTime(`${MSG.FIRST_ACTION_INFO(meta.action.type, style)}`)],
            status,
        });
    } else {
        output.add({
            type,
            args: [addTime(`${MSG.ACTION_INFO(meta.action.type, sender, style)}`)],
            status,
        });
    }

    if (meta.children) {
        printDispatches(output, meta.children, debugMode);
    }

    if (meta.changes && meta.changes.length) {
        printChanges(output, meta.changes, debugMode, Prefix.Mutation);
    }

    if (type !== 'info') {
        output.add('groupEnd');
    }
}
