import type { IListMobileMiddleware } from '../_interface/IListMobileTypes';
import { IListMobileActionType } from '../_interface/IListMobileTypes';
import { date as DateFormatter } from 'Types/formatter';

import { Model, Record as SbisRecord } from 'Types/entity';
import { RecordSet } from 'Types/collection';

const prettify = (obj: unknown): unknown => {
    if (obj instanceof Model || obj instanceof SbisRecord) {
        const result: Record<string, unknown> = {};
        const format = obj.getFormat();
        for (let index = format.getCount() - 1; index >= 0; index--) {
            const fieldName = format.at(index).getName();
            result[fieldName] = prettify(obj.get(fieldName));
        }
        return result;
    } else if (obj instanceof RecordSet) {
        const result: unknown[] = [];
        const enumerator = obj.getEnumerator();
        while (enumerator.moveNext()) {
            result.push(prettify(enumerator.getCurrent()));
        }
        return result;
    } else if (Array.isArray(obj)) {
        return obj.map(prettify);
    } else if (Object(obj) === obj) {
        return Object.entries(obj as Record<string, unknown>).reduce((acc, [key, value]) => {
            acc[key] = prettify(value);
            return acc;
        }, {} as Record<string, unknown>);
    } else {
        return obj;
    }
};

/**
 * Middleware для отладка
 * @private
 * @see Controls-Lists
 * К моменту выпуска будет удалён
 */
export const loggerMiddleware: IListMobileMiddleware = () => {
    const typeNameByValue = new Map(
        Object.entries(IListMobileActionType).map(([key, value]) => [value, key])
    );
    return (next) => (action) => {
        // eslint-disable-next-line no-console
        console.log(getTimeMark(), {
            type: typeNameByValue.get(action.type),
            payload: prettify(action.payload),
        });

        next(action);
    };
};

const getTimeMark = () => {
    return `[${DateFormatter(new Date(), 'mm:ss:SSS')}]`;
};
