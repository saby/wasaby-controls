export const addName = <T extends Function>(label: string, fn: T): T => {
    const wrapper = {
        [label]: ((...args: unknown[]) => fn(...args)) as unknown as T,
    };

    return wrapper[label];
};

const POSTFIX = '{name}';
export const createMask = <T extends string>(prefix: T) => `${prefix}(${POSTFIX})` as const;
export const decorateName = (mask: string, name: string) => mask.replace(POSTFIX, name);
export const undecorateName = (mask: string, decoratedName: string) => {
    const [start, end] = mask.split(POSTFIX);
    return decoratedName.replace(start, '').replace(end, '');
};
