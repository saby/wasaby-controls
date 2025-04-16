interface IInjectSource<
    TInstance extends Object = Object,
    TBindInstance extends Object = Object,
    TSource extends Object = Object,
> {
    instance: TInstance;
    bindInstance: TBindInstance;
    source: TSource;
    exclude?: (keyof TSource)[];
    include?: (keyof TSource)[];
}

/**
 * Проксирует методы source в instance
 * @param instance
 * @param bindInstance
 * @param source
 * @param notRewriteProperties
 */
export function injectSource<TInstance, TBindInstance, TSource>({
    instance,
    bindInstance,
    source,
    exclude,
    include,
}: IInjectSource<TInstance, TBindInstance, TSource>) {
    if (!source) {
        return;
    }

    const proto = Object.getPrototypeOf(source);

    if (proto && proto.constructor !== Object) {
        injectSource({
            instance,
            bindInstance,
            source: proto,
            exclude,
            include,
        });
    }

    for (const nameProperty of Object.getOwnPropertyNames(source)) {
        const description = Object.getOwnPropertyDescriptor(source, nameProperty);
        if (!description || typeof description.value !== 'function') {
            continue;
        }
        if (
            (!include || include.includes(nameProperty as keyof TSource)) &&
            (!exclude || !exclude.includes(nameProperty as keyof TSource))
        ) {
            instance[nameProperty] = source[nameProperty].bind(bindInstance);
        }
    }
}
