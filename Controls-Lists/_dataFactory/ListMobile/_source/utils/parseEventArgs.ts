import type { IAbstractStompEvent } from '../../_interface/IExternalTypes';

import { getRequestIdFromEvent } from './getRequestIdFromEvent';

export const parseEventArgs = (eventType: string, args: unknown[]): IAbstractStompEvent => {
    if (Array.isArray(args)) {
        return {
            type: eventType,
            args: args.slice(1),
            handleId: args[0] as string,
            requestId: getRequestIdFromEvent(args),
        };
    }

    return {
        type: eventType,
        args: [],
        handleId: args,
        requestId: getRequestIdFromEvent(args),
    };
};
