import type { TPath } from 'Controls-DataEnv/interface';
import type { Model } from 'Types/entity';

/**
 * Интерфейс состояния крошек
 */
export interface IBreadcrumbsState {
    /**
     * Хлебные крошки списка
     */
    breadCrumbsItems?: TPath;

    /**
     * Запись для кнопки назад
     */
    backButtonItem?: Model;
}
