import type { TSortingOptionValue } from 'Controls-DataEnv/listTypes';

/**
 * Интерфейс состояния для работы с сортировкой в списке с любым типом интерактора(web/mobile).
 */
export interface ISortingState {
    /**
     * Конфигурация {@link /doc/platform/developmentapl/interface-development/controls/list/sorting/ сортировки}
     * @remark
     * Допустимы значения направления сортировки ASC/DESC.
     *
     * <li>В таблицах можно изменять сортировку нажатием кнопки сортировки в конкретной ячейке заголовкв таблицы. Для этого нужно в {@link /doc/platform/developmentapl/interface-development/controls/list/grid/header/ конфигурации ячейки шапки} задать свойство {@link Controls/grid:IHeaderCell#sortingProperty sortingProperty}.
     * Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/list/grid/header/sorting/ здесь}</li>
     *
     * <li>При отсутствии заголовков в реестре можно воспользоваться кнопкой открытия меню сортировки. Для этого нужно добавить на страницу и настроить контрол {@link Controls/sorting:Selector}.
     * Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/list/sorting/table/ здесь}</li>
     *
     * @see Controls/sorting:Selector
     */
    sorting?: TSortingOptionValue;
}
