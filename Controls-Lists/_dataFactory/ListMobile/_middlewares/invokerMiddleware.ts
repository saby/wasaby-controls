import type { Collection as ICollection } from 'Controls/display';
import type { IListMobileMiddleware, IListMobileAction } from '../_interface/IListMobileTypes';
import type { ListMobileSourceController } from '../_sourceController/ListMobileSourceController';
import type { IRpcCommand } from '../_interface/IExternalTypes';

import { IListMobileActionType } from '../_interface/IListMobileTypes';
import * as actions from '../_actions';

export const getRpcCommand = (
    action: IListMobileAction,
    collection: ICollection
): {
    method: string;
    params: unknown[];
} => {
    switch (action.type) {
        case IListMobileActionType.MARK: {
            const method = 'mark';
            const params: Parameters<ListMobileSourceController[typeof method]> = [
                collection.getIndexByKey(action.payload.key),
            ];
            return {
                method,
                params,
            };
        }
        case IListMobileActionType.SELECT: {
            const method = 'select';
            const params: Parameters<ListMobileSourceController[typeof method]> = [
                collection.getIndexByKey(action.payload.key),
            ];
            return {
                method,
                params,
            };
        }
        case IListMobileActionType.CHANGE_ROOT: {
            const method = 'changeRoot';
            const params: Parameters<ListMobileSourceController[typeof method]> = [
                action.payload.root as string,
            ];
            return {
                method,
                params,
            };
        }
        default: {
            return null;
        }
    }
};

export const invokerMiddleware: IListMobileMiddleware = ({
    dispatch,
    collection,
    sourceController,
}) => {
    const onCommandStarted = (_: unknown, command: IRpcCommand) => {
        dispatch(actions.sendCommandStart(command));
    };
    const onCommandSucceeded = (_: unknown, command: IRpcCommand, response: unknown) => {
        dispatch(actions.sendCommandSuccess(command, response));
    };
    const onCommandFailed = (_: unknown, command: IRpcCommand, error: Error) => {
        dispatch(actions.sendCommandFail(command, error));
    };

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

        const command = getRpcCommand(action, collection);
        if (command != null) {
            const { method, params } = command;
            sourceController[method](...params);
        }

        next(action);
    };
};
