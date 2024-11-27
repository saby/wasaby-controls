import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { Model } from 'Types/entity';

/**
 * Тип действия, для обновления хлебных крошек.
 */
export type TSetBreadCrumbsAction = TAbstractAction<
    'setBreadCrumbs',
    {
        breadCrumbsItems: null | Model[];
        backButtonCaption: string;
        backButtonItem: Model;
    }
>;

/**
 * Тип действий функционала "Работа с хлебными крошками", доступные в WEB списке.
 */
export type TAnyBreadCrumbsAction = TSetBreadCrumbsAction;
