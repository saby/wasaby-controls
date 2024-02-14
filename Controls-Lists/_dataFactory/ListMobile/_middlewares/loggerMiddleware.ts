import type { IListMobileMiddleware } from '../_interface/IListMobileTypes';

import { IListMobileActionType } from '../_interface/IListMobileTypes';

export const loggerMiddleware: IListMobileMiddleware = () => {
    const typeNameByValue = new Map(
        Object.entries(IListMobileActionType).map(([key, value]) => [value, key])
    );
    const replacer = (key: string, value: unknown) => {
        if (key === 'response') {
            return '<Response></Response>>';
        } else if (key === 'error') {
            const errorMessage = (value as Error)?.message;
            return errorMessage ? `<Error>${errorMessage}</Error>` : value;
        }
        return value;
    };
    return (next) => (action) => {
        // eslint-disable-next-line no-console
        console.log(
            `{ "type": "${typeNameByValue.get(action.type)}", "payload": ${JSON.stringify(
                action.payload,
                replacer
            )} }`
        );

        next(action);
    };
};
