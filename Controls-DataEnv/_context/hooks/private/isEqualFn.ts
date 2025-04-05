import { isPlainObject as isPlainObjectTypes } from 'Types/object';

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return isPlainObjectTypes(value);
}

export default function isEqualFn<T>(a: T, b: T): boolean {
    if (Object.is(a, b)) {
        return true;
    }
    if (!isPlainObject(a) || !isPlainObject(b)) {
        return false;
    }
    const bothKeys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const key of bothKeys) {
        if (!Object.is(a[key], b[key])) {
            return false;
        }
    }
    return true;
}
