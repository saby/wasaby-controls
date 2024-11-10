export type TBeforeComplexUpdate = {
    isComplexUpdate?: boolean;
    _needReloadBySourceController?: boolean;
    additionalPromise?: PromiseLike<unknown>;
};
