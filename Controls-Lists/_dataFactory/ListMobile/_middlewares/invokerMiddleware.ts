import type { CrudEntityKey } from 'Types/source';
import type { IListMobileAction, IListMobileMiddleware } from '../_interface/IListMobileTypes';
import { IListMobileActionType } from '../_interface/IListMobileTypes';
import type { SourceController } from '../_sourceController/SourceController';
import type { TRpcCommand } from '../_interface/IExternalTypes';
import * as actions from '../_actions';

type IExtractIndex = (action: { payload: { key: CrudEntityKey } }) => number;

export const sendRpcCommand = (
    sourceController: SourceController,
    action: IListMobileAction,
    extractIndex: IExtractIndex
): unknown => {
    switch (action.type) {
        case IListMobileActionType.CHANGE_ROOT:
            return sourceController.changeRoot(action.payload.root);
        case IListMobileActionType.MARK:
            return sourceController.mark(extractIndex(action));
        case IListMobileActionType.SELECT:
            return sourceController.select(extractIndex(action), action.payload.direction);
        case IListMobileActionType.SELECT_ALL:
            return sourceController.selectAll();
        case IListMobileActionType.INVERT_SELECTION:
            return sourceController.invertSelection();
        case IListMobileActionType.RESET_SELECTION:
            return sourceController.resetSelection();
        case IListMobileActionType.EXPAND:
            return sourceController.expand(extractIndex(action));
        case IListMobileActionType.COLLAPSE:
            return sourceController.collapse(extractIndex(action));
        case IListMobileActionType.NEXT:
            return sourceController.next(extractIndex(action));
        case IListMobileActionType.PREV:
            return sourceController.prev(extractIndex(action));
        case IListMobileActionType.SET_FILTER:
            return sourceController.setFilter(action.payload.filter);
    }
};

export const invokerMiddleware: IListMobileMiddleware = ({
    dispatch,
    virtualCollection,
    sourceController,
}) => {
    const onCommandStarted = (_: unknown, command: TRpcCommand) =>
        dispatch(actions.sendCommandStart(command));
    const onCommandSucceeded = (_: unknown, command: TRpcCommand, response: unknown) =>
        dispatch(actions.sendCommandSuccess(command, response));
    const onCommandFailed = (_: unknown, command: TRpcCommand, error: Error) =>
        dispatch(actions.sendCommandFail(command, error));
    const extractIndex: IExtractIndex = ({ payload: { key } }) =>
        virtualCollection.getIndexByKey(key);

    return (next) => (action) => {
        switch (action.type) {
            case IListMobileActionType.CONNECT: {
                sourceController.subscribe('commandStarted', onCommandStarted);
                sourceController.subscribe('commandSucceeded', onCommandSucceeded);
                sourceController.subscribe('commandFailed', onCommandFailed);
                break;
            }
            case IListMobileActionType.DISCONNECT: {
                sourceController.unsubscribe('commandStarted', onCommandStarted);
                sourceController.unsubscribe('commandSucceeded', onCommandSucceeded);
                sourceController.unsubscribe('commandFailed', onCommandFailed);
                break;
            }
        }

        sendRpcCommand(sourceController, action, extractIndex);

        next(action);
    };
};
