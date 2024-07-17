import type {
    IExpandCollapseState,
    IHierarchySelectionState,
    IHighlightFieldsState,
    IItemActionsState,
    IItemsState,
    IMarkerState,
    IOperationsPanelState,
    IPathState,
    IRootState,
    IStubState,
} from 'Controls/listAspects';

import type { ICollectionOptions } from 'Controls/display';
import type { IFilterItem } from 'Controls/filter';
import type { TFilter } from 'Controls/interface';
import type { THeaderVisibility } from 'Controls/grid';
import type { IEmptyViewConfig } from 'Controls/gridReact';

/**
 * Интерфейс опций, которые логически не должны быть на интеракторе,
 * но сейчас должны быть заданы на нем, для проксирования в коллекцию.
 *
 * !!!ВНИМАНИЕ!!!
 * КАЖДАЯ ОПЦИЯ МОЖЕТ БЫТЬ ДОБАВЛЕНА ТОЛЬКО С ССЫЛКОЙ НА ЗАДАЧУ,
 * ГДЕ СФОРМУЛИРОВАНО КАКОЙ ПЛАСТ ЛОГИКИ ДОЛЖЕН УЙТИ С КОЛЛЕКЦИИ ВО ВЬЮ
 * @private
 * */
export interface IStateThatShouldGoIntoViewLayer {
    /**
     * @deprecated НЕ ИСПОЛЬЗОВАТЬ.
     * Интерактор не должен конфигурировать шапку на коллекции, т.к. предполагается отказ от
     * этой коллекциив сторону массива и отдельных опций, за которые отвечает интерактор.
     * Решение какую запись стикать, а какую нет не входит в его обязанности.
     *
     * https://online.sbis.ru/opendoc.html?guid=a962063f-f674-44d5-b31f-a1f0848f217e&client=3
     */
    stickyHeader?: ICollectionOptions['stickyHeader'];
    headerVisibility?: THeaderVisibility;

    /**
     * https://online.sbis.ru/opendoc.html?guid=42b5e265-c380-4503-ad90-9df46426d313&client=3
     */
    rowSeparatorSize?: ICollectionOptions['rowSeparatorSize'];
    rowSeparatorVisibility?: ICollectionOptions['rowSeparatorVisibility'];
    /**
     * https://online.sbis.ru/opendoc.html?guid=18702801-b618-459e-b078-72b4ffdb48df&client=3
     */
    emptyTemplate?: ICollectionOptions['emptyTemplate'];
    emptyTemplateOptions?: object;
    emptyView?: IEmptyViewConfig[];
    emptyViewConfig?: object;
}

/**
 * Интерфейс состояния абстрактного списочного слайса.
 * @interface Controls/_dataFactory/AbstractList/_interface/IAbstractListSliceState
 * @public
 */
export type IAbstractListSliceState = IMarkerState &
    IPathState &
    IItemsState &
    IHierarchySelectionState &
    IRootState &
    IExpandCollapseState &
    IOperationsPanelState &
    IHighlightFieldsState &
    IItemActionsState &
    IStubState &
    IStateThatShouldGoIntoViewLayer & {
        filter: TFilter;
        filterDescription?: IFilterItem[];
    };
