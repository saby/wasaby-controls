/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TListMobileMiddleware } from '../types/TListMobileMiddleware';
import type { TRpcCommand } from '../_interface/IExternalTypes';
import type { IStompEventListener } from '../_interface/IExternalTypes';
import { ListMobileActionCreators } from '../actions';

const { rpcEvents, rpcWorker } = ListMobileActionCreators;

/**
 * Middleware-функция, устанавливающая и разрывающая подключение к удаленному источнику данных, а также прослушивающая его события.
 */
export const rpcWorkerMiddleware: TListMobileMiddleware = ({
    dispatch,
    scheduleDispatch,
    sourceController: RpcFacade,
}) => {
    const onCommandStarted = (_: unknown, command: TRpcCommand) =>
        dispatch(rpcWorker.sendCommandStart(command));
    const onCommandSucceeded = (_: unknown, command: TRpcCommand, response: unknown) =>
        dispatch(rpcWorker.sendCommandSuccess(command, response));
    const onCommandFailed = (_: unknown, command: TRpcCommand, error: Error) =>
        dispatch(rpcWorker.sendCommandFail(command, error));

    const onEventGroup: IStompEventListener = async (_, event) => {
        scheduleDispatch(rpcEvents.receiveEventGroup(event));
    };

    const subscribeToRpcFacade = () => {
        RpcFacade.subscribe('commandStarted', onCommandStarted);
        RpcFacade.subscribe('commandSucceeded', onCommandSucceeded);
        RpcFacade.subscribe('commandFailed', onCommandFailed);
        RpcFacade.subscribe('receiveEvent', onEventGroup);
    };

    const unsubscribeFromRpcFacade = () => {
        RpcFacade.unsubscribe('commandStarted', onCommandStarted);
        RpcFacade.unsubscribe('commandSucceeded', onCommandSucceeded);
        RpcFacade.unsubscribe('commandFailed', onCommandFailed);
        RpcFacade.unsubscribe('receiveEvent', onEventGroup);
    };

    return (next) => async (action) => {
        switch (action.type) {
            case 'connect': {
                subscribeToRpcFacade();

                await dispatch(rpcWorker.openConnectionStart());

                // Не ждем подключения.
                RpcFacade.connect()
                    .then(() => dispatch(rpcWorker.openConnectionSuccess()))
                    .catch((error) => dispatch(rpcWorker.openConnectionFail(error)));

                break;
            }
            case 'disconnect': {
                unsubscribeFromRpcFacade();

                await dispatch(rpcWorker.closeConnectionStart());

                // Не ждем отключения.
                RpcFacade.disconnect()
                    .then(() => dispatch(rpcWorker.closeConnectionSuccess()))
                    .catch((error) => dispatch(rpcWorker.closeConnectionFail(error)));

                break;
            }
        }
        next(action);
    };
};
