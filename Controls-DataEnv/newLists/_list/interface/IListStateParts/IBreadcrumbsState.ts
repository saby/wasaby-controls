import type { TPath } from 'Controls-DataEnv/interface';
import type { Model } from 'Types/entity';
import type { IAbstractListStateParts } from 'Controls-DataEnv/abstractList';

/**
 * Интерфейс состояния крошек
 */
export interface IBreadcrumbsState extends IAbstractListStateParts.IBreadcrumbsState {
    breadCrumbsItemsWithoutBackButton?: TPath;
    backButtonItem?: Model;
    displayProperty?: string;
    backButtonCaption?: string;
}
