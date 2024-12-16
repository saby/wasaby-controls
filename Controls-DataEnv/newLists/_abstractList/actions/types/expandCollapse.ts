import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { CrudEntityKey } from 'Types/source';
import type { TExpansionModel } from '../../interface/IAbstractListStateParts/IHierarchyState';

/**
 * Тип действия для разворота узла.
 */
export type TExpandAction = TAbstractAction<
    'expand',
    {
        key: CrudEntityKey;
        markItem?: boolean;
    }
>;

/**
 * Тип действия для сворачивания узла.
 */
export type TCollapseAction = TAbstractAction<
    'collapse',
    {
        key: CrudEntityKey;
        markItem?: boolean;
    }
>;

/**
 * Тип действия для сброса состояния разворота узлов.
 */
export type TResetExpansionAction = TAbstractAction<'resetExpansion', {}>;

/**
 * Тип действия для установки новой модели раскрытых узлов.
 */
export type TSetExpansionModelAction = TAbstractAction<
    'setExpansionModel',
    {
        expansionModel: TExpansionModel;
    }
>;

/**
 * Тип действий функционала "Разворот и сворачивание узлов", доступные в любом списке,
 * независимо от типа ViewModel, к которой он подключен (web/mobile).
 * @see https://online.sbis.ru/area/4dc07e22-16bc-4793-9b70-c6819cf515fb Зона Kaizen
 */
export type TAnyExpandCollapseAction =
    | TExpandAction
    | TCollapseAction
    | TResetExpansionAction
    | TSetExpansionModelAction;
