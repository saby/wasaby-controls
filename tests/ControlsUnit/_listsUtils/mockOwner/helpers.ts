// eslint-disable max-len
// region Вспомогательные методы, поддерживающие типизацию. Не нужно их трогать.
export function extractParam<TParams, TKey extends keyof TParams>(
    params: TParams,
    pName: TKey,
    defaultValue?: unknown
): TParams[TKey] {
    return (params.hasOwnProperty(pName)
        ? params[pName]
        : defaultValue) as unknown as TParams[TKey];
}

export function extractParamWithCallback<TParams, TKey extends keyof TParams>(
    params: TParams,
    pName: TKey,
    defaultValueCallback: () => TParams[TKey]
): TParams[TKey] {
    if (params.hasOwnProperty(pName)) {
        return params[pName];
    }
    return defaultValueCallback ? defaultValueCallback() : undefined;
}

/* eslint-enable max-len */
