/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
interface IPrefetchPromises {
    // TODO: Compatible предзагрузка
    [key: string]: Promise<unknown>;
}

export interface IPrefetchData {
    // TODO: Compatible предзагрузка
    [key: string]: unknown;
}

/**
 * Преобразовывает prefetchPromise в prefetchData
 * TODO: Этого не должно быть, должно быть у сухоручкина, когда будут pageId
 * @param prefetchPromise
 */
function waitPrefetchData(
    prefetchPromise: Promise<IPrefetchPromises>
): Promise<IPrefetchData> {
    return prefetchPromise.then((prefetchPromiseData: IPrefetchPromises) => {
        const promiseArray = Object.values(prefetchPromiseData);
        return Promise.allSettled(promiseArray).then(
            (
                dataArray: {
                    status: string;
                    value?: unknown;
                    reason?: unknown;
                }[]
            ) => {
                const keys = Object.keys(prefetchPromiseData);
                const data = {};
                let i = 0;
                for (const key of keys) {
                    const promiseResult = dataArray[i++];
                    data[key] =
                        typeof promiseResult.value === 'undefined'
                            ? promiseResult.reason
                            : promiseResult.value;
                }
                return data;
            }
        );
    });
}

export { waitPrefetchData };
