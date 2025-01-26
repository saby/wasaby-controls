/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { ActionsNames } from '../ActionsNames';
import { rpcWorker } from '../types';
import { TRpcCommand } from '../../_interface/IExternalTypes';

export const sendCommandStart = (command: TRpcCommand): rpcWorker.TSendCommandStartAction => ({
    type: ActionsNames.SEND_COMMAND_STARTED,
    payload: {
        command,
    },
});

export const sendCommandSuccess = (
    command: TRpcCommand,
    response: unknown
): rpcWorker.TSendCommandSuccessAction => ({
    type: ActionsNames.SEND_COMMAND_SUCCEEDED,
    payload: {
        command,
        response,
        requestId: undefined,
    },
});

export const sendCommandFail = (
    command: TRpcCommand,
    error: Error
): rpcWorker.TSendCommandFailAction => ({
    type: ActionsNames.SEND_COMMAND_FAILED,
    payload: {
        command,
        error,
    },
});

export const openConnectionStart = (): rpcWorker.TOpenConnectionStartAction => ({
    type: ActionsNames.OPEN_CONNECTION_STARTED,
    payload: {},
});

export const openConnectionSuccess = (): rpcWorker.TOpenConnectionSuccessAction => ({
    type: ActionsNames.OPEN_CONNECTION_SUCCEEDED,
    payload: {},
});

export const openConnectionFail = (error: Error): rpcWorker.TOpenConnectionFailAction => ({
    type: ActionsNames.OPEN_CONNECTION_FAILED,
    payload: {
        error,
    },
});

export const closeConnectionStart = (): rpcWorker.TCloseConnectionStartAction => ({
    type: ActionsNames.CLOSE_CONNECTION_STARTED,
    payload: {},
});

export const closeConnectionSuccess = (): rpcWorker.TCloseConnectionSuccessAction => ({
    type: ActionsNames.CLOSE_CONNECTION_SUCCEEDED,
    payload: {},
});

export const closeConnectionFail = (error: Error): rpcWorker.TCloseConnectionFailAction => ({
    type: ActionsNames.CLOSE_CONNECTION_FAILED,
    payload: { error },
});
