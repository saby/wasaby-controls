import type { IListMobileMiddleware, IListMobileAction } from '../_interface/IListMobileTypes';
import type { SourceController } from '../_sourceController/SourceController';
import type { IRpcCommand } from '../_interface/IExternalTypes';

import { IListMobileActionType } from '../_interface/IListMobileTypes';
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
            return sourceController.select(extractIndex(action));
        case IListMobileActionType.EXPAND:
            return sourceController.expand(extractIndex(action));
        case IListMobileActionType.COLLAPSE:
            return sourceController.collapse(extractIndex(action));
        case IListMobileActionType.NEXT:
            return sourceController.next(extractIndex(action));
        case IListMobileActionType.PREV:
            return sourceController.prev(extractIndex(action));
    }
};

export const invokerMiddleware: IListMobileMiddleware = ({
    dispatch,
    virtualCollection,
    sourceController,
}) => {
    const onCommandStarted = (_: unknown, command: IRpcCommand) =>
        dispatch(actions.sendCommandStart(command));
    const onCommandSucceeded = (_: unknown, command: IRpcCommand, response: unknown) =>
        dispatch(actions.sendCommandSuccess(command, response));
    const onCommandFailed = (_: unknown, command: IRpcCommand, error: Error) =>
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
