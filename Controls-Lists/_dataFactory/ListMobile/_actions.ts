import type { CrudEntityKey } from 'Types/source';
import type { IRequestId, IRpcCommand, IStompEvent } from './_interface/IExternalTypes';
import type { IListMobileAction } from './_interface/IListMobileTypes';

import { IListMobileActionType } from './_interface/IListMobileTypes';

const getRequestIdFromResponse = (response: unknown): IRequestId => {
    // TODO сейчас бекенд не возвращает requestId, но в светлом будущем должен
    // requestId нужен для параллельного выполнения нескольких асинхронных операций с ожиданием данных за раз
    // без него невозможно однозначно связать посланную команду и результаты, которые прислал бекенд
    void response;
    return undefined;
};

export const connect = (): IListMobileAction => ({
    type: IListMobileActionType.CONNECT,
    payload: {},
});

export const disconnect = (): IListMobileAction => ({
    type: IListMobileActionType.DISCONNECT,
    payload: {},
});

export const mark = (key: CrudEntityKey): IListMobileAction => ({
    type: IListMobileActionType.MARK,
    payload: {
        key,
    },
});

export const select = (key: CrudEntityKey): IListMobileAction => ({
    type: IListMobileActionType.SELECT,
    payload: {
        key,
    },
});

export const sendCommandStart = (command: IRpcCommand): IListMobileAction => ({
    type: IListMobileActionType.SEND_COMMAND_STARTED,
    payload: {
        command,
    },
});

export const sendCommandSuccess = (command: IRpcCommand, response: unknown): IListMobileAction => ({
    type: IListMobileActionType.SEND_COMMAND_SUCCEEDED,
    payload: {
        command,
        response,
        requestId: getRequestIdFromResponse(response),
    },
});

export const sendCommandFail = (command: IRpcCommand, error: Error): IListMobileAction => ({
    type: IListMobileActionType.SEND_COMMAND_FAILED,
    payload: {
        command,
        error,
    },
});

export const receiveEventGroup = (
    events: IStompEvent[],
    errors: Error[],
    requestId: IRequestId
): IListMobileAction => ({
    type: IListMobileActionType.RECEIVE_EVENT_GROUP,
    payload: {
        requestId,
        events,
        errors,
    },
});

export const openEventChannelStart = (): IListMobileAction => ({
    type: IListMobileActionType.OPEN_EVENT_CHANNEL_STARTED,
    payload: {},
});

export const openEventChannelSuccess = (): IListMobileAction => ({
    type: IListMobileActionType.OPEN_EVENT_CHANNEL_SUCCEEDED,
    payload: {},
});

export const openEventChannelFail = (error: Error): IListMobileAction => ({
    type: IListMobileActionType.OPEN_EVENT_CHANNEL_FAILED,
    payload: {
        error,
    },
});

export const closeEventChannelStart = (): IListMobileAction => ({
    type: IListMobileActionType.CLOSE_EVENT_CHANNEL_STARTED,
    payload: {},
});

export const closeEventChannelSuccess = (): IListMobileAction => ({
    type: IListMobileActionType.CLOSE_EVENT_CHANNEL_SUCCEEDED,
    payload: {},
});

export const closeEventChannelFail = (error: Error): IListMobileAction => ({
    type: IListMobileActionType.CLOSE_EVENT_CHANNEL_FAILED,
    payload: { error },
});

export const changeRoot = (root: CrudEntityKey | null): IListMobileAction => ({
    type: IListMobileActionType.CHANGE_ROOT,
    payload: { root },
});

export const expand = (key: CrudEntityKey): IListMobileAction => ({
    type: IListMobileActionType.EXPAND,
    payload: {
        key,
    },
});

export const collapse = (key: CrudEntityKey): IListMobileAction => ({
    type: IListMobileActionType.COLLAPSE,
    payload: {
        key,
    },
});

export const next = (key: CrudEntityKey): IListMobileAction => ({
    type: IListMobileActionType.NEXT,
    payload: {
        key,
    },
});

export const prev = (key: CrudEntityKey): IListMobileAction => ({
    type: IListMobileActionType.PREV,
    payload: {
        key,
    },
});
