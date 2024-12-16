import type { Collection as ICollection } from 'Controls/display';
import type { TAbstractListActions } from 'Controls-DataEnv/abstractList';

/**
 * Интерфейс базовых состояний, не относящихся к функциональным зонам.
 */
export interface ICoreState {
    collection?: ICollection;
    // Флаг нужен, чтобы слайс не разрушал sourceController, если слайс был порождён внутри Browser'a
    // В этом случае сам Browser разрушает sourceController
    sliceOwnedByBrowser?: boolean;

    displayProperty?: string;

    /**
     * Определяет, происходит ли в интеракторе загрузка.
     * Загрузка это любая длительная операция, например ожидание данных
     * или статики для отображения.
     * */
    loading: boolean;

    command?: string;

    /**
     * Определяет, используется ли самая свежая версия интерактора.
     * Должна быть установлена в false в любом платформенном
     * классе наследнике за пределами модуля Controls-DataEnv.
     */
    isLatestInteractorVersion: boolean;

    // TODO: Надо как то со стейта убрать.
    //  Если получится свести типы, то надо заприватить через символ.
    /**
     * НЕ ИСПОЛЬЗОВАТЬ
     * Временное внутреннее состояние интерактора.
     * В скором времени будет удалено без обратной совместимости.
     */
    _actionToDispatch?: TAbstractListActions.TAnyAbstractAction[];
}
