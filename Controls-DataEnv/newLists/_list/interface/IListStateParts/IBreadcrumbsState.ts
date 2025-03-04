import type { TPath } from 'Controls-DataEnv/interface';
import type { Model } from 'Types/entity';
import type { IAbstractListStateParts } from 'Controls-DataEnv/abstractList';

/**
 * Интерфейс состояния крошек
 */
export interface IBreadcrumbsState extends IAbstractListStateParts.IBreadcrumbsState {
    /**
     * Хлебные крошки списка без учета кнопки назад.
     */
    breadCrumbsItemsWithoutBackButton?: TPath;
    backButtonItem?: Model;
    displayProperty?: string;
    /**
     * Заголовок кнопки назад. Составляется на основе хлебных крошек списка
     */
    backButtonCaption?: string;
}
