/**
 * @kaizen_zone 02f42333-cf50-42e8-bc08-b451cc483285
 */
import { Rpc } from 'Types/source';
import { TSelectionRecord, ISelectionObject, TSelectionCountMode } from 'Controls/interface';
import selectionToRecord from 'Controls/Utils/selectionToRecord';
import { Record } from 'Types/entity';

type TCount = null | number | void;

export interface IGetCountCallParams {
    rpc: Rpc;
    data: object;
    command: string;
}

function getDataForCallWithSelection(
    selection: ISelectionObject,
    callParams: IGetCountCallParams,
    selectionCountMode: TSelectionCountMode = 'all',
    recursive?: boolean
): object {
    const data = { ...(callParams.data || {}) };
    const filter = { ...(data.filter || {}) };
    const adapter = callParams.rpc.getAdapter();

    Object.assign(filter, {
        selection: getSelectionRecord(selection, callParams.rpc, selectionCountMode, recursive),
    });
    data.filter = Record.fromObject(filter, adapter);

    return data;
}

function getSelectionRecord(
    selection: ISelectionObject,
    rpc: Rpc,
    selectionCountMode: TSelectionCountMode,
    recursive?: boolean
): TSelectionRecord {
    return selectionToRecord(selection, rpc.getAdapter(), selectionCountMode, recursive);
}

function getCount(
    selection: ISelectionObject,
    callParams: IGetCountCallParams,
    selectionCountMode?: TSelectionCountMode,
    recursive?: boolean
): Promise<TCount> {
    const data = getDataForCallWithSelection(selection, callParams, selectionCountMode, recursive);

    return callParams.rpc.call(callParams.command, data).then((dataSet) => {
        return dataSet.getRow().get('count') as number;
    });
}

export default {
    getCount,
};
