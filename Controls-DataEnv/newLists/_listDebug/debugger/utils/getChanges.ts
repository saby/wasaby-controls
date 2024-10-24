/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { isEqual } from 'Types/object';

export interface IChange {
    key: string;
    prev: unknown;
    next: unknown;
    isEqualValue: boolean;
    isEqualRef: boolean;
}

export const getChanges = (prevState: unknown, nextState: unknown): IChange[] => {
    const changes: IChange[] = [];

    const keys = Array.from(
        new Set([...Object.keys(prevState as object), ...Object.keys(nextState as object)])
    );

    for (const key of keys) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const prev = prevState[key] as unknown;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const next = nextState[key] as unknown;

        const isEqualRef = prev === next;

        const isEqualValue = isEqual(prev, next);

        if (!isEqualValue || !isEqualRef) {
            changes.push({
                key,
                prev,
                next,
                isEqualValue,
                isEqualRef,
            });
        }
    }

    return changes;
};

export const prettifyChange = (prev: unknown, next: unknown): unknown[] => {
    const isPrimitive = (v: unknown) =>
        ['undefined', 'string', 'boolean', 'number', 'symbol', 'bigint'].indexOf(typeof v) !== -1 ||
        v === null;
    if (isPrimitive(prev) && isPrimitive(next)) {
        return [prev, '=>', next];
    } else {
        return [[prev, next]];
    }
};
