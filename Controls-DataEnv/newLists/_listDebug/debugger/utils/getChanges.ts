import { isEqual } from 'Types/object';

/**
 *
 */
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

        const isEqualValue = isEqual(prepareObj(prev), prepareObj(next));

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

const prepareObj = (obj: unknown) => {
    return obj instanceof Map || obj instanceof Set ? Array.from(obj.entries()) : obj;
};

export const prettifyChange = (prev: unknown, next: unknown): unknown[] => {
    const isPrimitive = (v: unknown) =>
        ['undefined', 'string', 'boolean', 'number', 'symbol', 'bigint'].indexOf(typeof v) !== -1 ||
        v === null;
    const isPrevPrimitive = isPrimitive(prev);
    const isNextPrimitive = isPrimitive(next);

    const printPrimitive = (v: unknown, showType: boolean = false) => {
        const type = typeof v;
        if (type === 'undefined') {
            return showType ? type : v;
        } else if (v === null) {
            return showType ? 'null' : v;
        } else {
            return showType ? `${type}(${v})` : v;
        }
    };

    if (isPrevPrimitive === isNextPrimitive && isPrevPrimitive) {
        return [`${printPrimitive(prev, true)} => ${printPrimitive(next, true)}`];
    } else {
        return [
            [
                isPrevPrimitive ? printPrimitive(prev) : prev,
                isNextPrimitive ? printPrimitive(next) : next,
            ],
        ];
    }
};
