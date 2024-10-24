/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { TAbstractAction } from 'Controls-DataEnv/newLists/_dispatcher/types/TAbstractAction';

const SENDER_NAME = Symbol('SENDER_NAME');

export const PUBLIC_API_SENDER_NAME = Symbol('PUBLIC_API');

export const setSender = (
    action: TAbstractAction,
    senderName: string | typeof PUBLIC_API_SENDER_NAME
) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    action[SENDER_NAME] = senderName;
};

export const getSender = (action: TAbstractAction): string | typeof PUBLIC_API_SENDER_NAME =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    action[SENDER_NAME];
