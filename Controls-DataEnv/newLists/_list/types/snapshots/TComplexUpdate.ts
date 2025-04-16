import type { IListState } from '../../interface/IListState';

export type TComplexUpdate = {
    isReducingState?: boolean;
    // флаг, использующийся для приоритизации состояния прикладника над платформенным поведением
    isBeforeApplyState?: boolean;
    isPublicSetState?: boolean;
    _needReloadBySourceController?: boolean;
    additionalPromise?: Promise<Partial<IListState>>;
};
