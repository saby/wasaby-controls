export type TComplexUpdate = {
    isReducingState?: boolean;
    isEndUpdate?: boolean;
    _needReloadBySourceController?: boolean;
    additionalPromise?: PromiseLike<unknown>;
};
