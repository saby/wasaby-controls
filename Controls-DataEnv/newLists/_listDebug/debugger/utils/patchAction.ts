import { TAbstractAction } from 'Controls-DataEnv/newLists/_dispatcher/types/TAbstractAction';

const SENDER_NAME = Symbol('SENDER_NAME');

const PUBLIC_API_SENDER_NAME = Symbol('PUBLIC_API');
const actionTraceSymbol = Symbol('actionTraceSymbol');

export const setSender = (
    action: TAbstractAction,
    senderName: string | typeof PUBLIC_API_SENDER_NAME
) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    action[SENDER_NAME] = senderName;
};

export const getSender = (action: TAbstractAction): string => String(_getSender(action));

const _getSender = (action: TAbstractAction): string | typeof PUBLIC_API_SENDER_NAME =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    String(action[SENDER_NAME]);

export const setPublicAsSender = (action: TAbstractAction) => {
    setSender(action, PUBLIC_API_SENDER_NAME);
};

export const isPublicSender = (action: TAbstractAction): boolean =>
    _getSender(action) === PUBLIC_API_SENDER_NAME;

export const setActionTrace = (action: TAbstractAction, trace: string) => {
    (action as TAbstractAction & { [actionTraceSymbol]: string })[actionTraceSymbol] = trace;
};

export const getActionTrace = (action: TAbstractAction) => {
    return (action as TAbstractAction & { [actionTraceSymbol]: string })[actionTraceSymbol];
};
