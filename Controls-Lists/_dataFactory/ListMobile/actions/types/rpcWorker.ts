/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TRpcCommand } from '../../_interface/IExternalTypes';
import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import { ActionsNames } from '../ActionsNames';

export type TSendCommandStartAction = TAbstractAction<
    ActionsNames.SEND_COMMAND_STARTED,
    {
        command: TRpcCommand;
    }
>;

export type TSendCommandSuccessAction = TAbstractAction<
    ActionsNames.SEND_COMMAND_SUCCEEDED,
    {
        command: TRpcCommand;
        response: unknown;
        requestId: undefined;
    }
>;

export type TSendCommandFailAction = TAbstractAction<
    ActionsNames.SEND_COMMAND_FAILED,
    {
        command: TRpcCommand;
        error: Error;
    }
>;

export type TOpenConnectionStartAction = TAbstractAction<ActionsNames.OPEN_CONNECTION_STARTED>;

export type TOpenConnectionSuccessAction = TAbstractAction<ActionsNames.OPEN_CONNECTION_SUCCEEDED>;

export type TOpenConnectionFailAction = TAbstractAction<
    ActionsNames.OPEN_CONNECTION_FAILED,
    {
        error: Error;
    }
>;

export type TCloseConnectionStartAction = TAbstractAction<ActionsNames.CLOSE_CONNECTION_STARTED>;

export type TCloseConnectionSuccessAction =
    TAbstractAction<ActionsNames.CLOSE_CONNECTION_SUCCEEDED>;

export type TCloseConnectionFailAction = TAbstractAction<
    ActionsNames.CLOSE_CONNECTION_FAILED,
    {
        error: Error;
    }
>;

export type TAnyRpcWorkerAction =
    | TSendCommandStartAction
    | TSendCommandSuccessAction
    | TSendCommandFailAction
    | TOpenConnectionStartAction
    | TOpenConnectionSuccessAction
    | TOpenConnectionFailAction
    | TCloseConnectionStartAction
    | TCloseConnectionSuccessAction
    | TCloseConnectionFailAction;
