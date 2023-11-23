/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
import { Control, IControlOptions } from 'UI/Base';
import {
    ColumnScrollController,
    ScrollBar,
    DragScrollController,
    StyleContainers,
    IScrollBarOptions,
} from 'Controls/columnScroll';
import { TKey } from 'Controls/interface';
import { SyntheticEvent } from 'UI/Vdom';
import { DestroyableMixin } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { Register } from 'Controls/event';

interface IColumnScrollMixinOptions {
    columnScroll?: boolean;
    dragScrolling?: boolean;
    preventServerSideColumnScroll?: boolean;
    stickyColumnsCount?: number;
    isFullGridSupport: boolean;
    startDragNDropCallback?: () => void;
    columnScrollViewMode?: IScrollBarOptions['mode'];
}

interface IViewOptions extends IControlOptions, IColumnScrollMixinOptions {
    columns: Object[];
    header: Object[];
    items: RecordSet;
    backgroundStyle?: string;
    needShowEmptyTemplate?: boolean;
    expandedItems?: TKey[];
    collapsedItems?: TKey[];
    itemsDragNDrop?: boolean;
    headerVisibility?: string;
    headerInEmptyListVisible?: boolean;
    columnScrollStartPosition?: 'end';
    itemActionsPosition?: string;
    multiSelectVisibility?: string;
    multiSelectPosition?: string;
    resizerVisibility?: boolean;
}

interface IView extends Control<IViewOptions> {
    _children: {
        gridWrapper: HTMLDivElement;
        grid: HTMLDivElement | HTMLTableElement;
        horizontalScrollBar: ScrollBar;
        columnScrollStyleContainers: StyleContainers;
        scrollDetect: Register;
    } & ({ results: HTMLDivElement } | { header: HTMLDivElement });

    _getStickyLadderCellsCount: (options: IViewOptions) => number;
    _notify: (eventName: string, args?: unknown[], options?: { bubbling?: boolean }) => void;
    _hasItemActionsCell(options: IViewOptions): boolean;
    getListModel(): DestroyableMixin & {
        setStickyColumnsCount(stickyColumnsCount: number): void;
    };
}

interface IColumnScrollViewMixin {
    '[Controls/_grid/ViewMixins/ColumnScroll]': true;
    _$columnScrollController: ColumnScrollController;
    _$columnScrollSelector: string;
    _$dragScrollController: DragScrollController;
    _$dragScrollStylesContainer: HTMLStyleElement;
    _$columnScrollFreezeCount: number;
    _$columnScrollEmptyViewMaxWidth: number;
    // Состояние, показывающее, что ожидается завершение слудующей перерисовки для обновления состояний контроллеров.
    _$oldOptionsForPendingUpdate: IViewOptions;

    // Scrolled to end server-side render
    _$columnScrollUseFakeRender: boolean | 'partial';
    _$pendingMouseEnterForActivate: boolean;

    _gridInHiddenContainer: boolean;

    _$relativeCellContainers: HTMLElement[];
    _relativeCellContainersUpdateCallback(newContainers: HTMLElement[]): void;

    // IFreezable
    _freezeColumnScroll(): void;
    _unFreezeColumnScroll(): void;
    _isColumnScrollFrozen(): boolean;

    // Hooks
    _columnScrollOnViewBeforeMount(options: IViewOptions): void;
    _columnScrollOnViewDidMount(): void;
    _columnScrollOnViewBeforeUpdate(newOptions: IViewOptions): void;
    _columnScrollOnViewDidUpdate(oldOptions: IViewOptions): void;
    _columnScrollOnViewBeforeUnmount(): void;

    // Methods
    isColumnScrollVisible(): boolean;
    scrollToColumn(columnIndex: number): void;
    scrollToLeft(): void;
    scrollToRight(): void;
    _resetColumnScroll(position: IViewOptions['columnScrollStartPosition']): void;
    _isDragScrollEnabledByOptions(options: IViewOptions): boolean;
    _getColumnScrollThumbStyles(options: IViewOptions): string;
    _getColumnScrollWrapperClasses(options: IViewOptions): string;
    _getColumnScrollContentClasses(
        options: IViewOptions,
        columnScrollPartName?: 'fixed' | 'scrollable'
    ): string;

    // EventHandlers
    _onColumnScrollThumbPositionChanged(e: SyntheticEvent<null>, newPosition: number): void;
    _onColumnScrollThumbDragEnd(e: SyntheticEvent<null>): void;
    _onColumnScrollViewMouseEnter(e: SyntheticEvent<MouseEvent>): void;
    _onColumnScrollViewWheel(e: SyntheticEvent<WheelEvent>): void;
    _onColumnScrollViewResized(): void;
    _onColumnScrollStartDragScrolling(
        e: SyntheticEvent<TouchEvent | MouseEvent>,
        startBy: 'mouse' | 'touch'
    ): void;
    _onColumnScrollDragScrolling(
        e: SyntheticEvent<TouchEvent | MouseEvent>,
        startBy: 'mouse' | 'touch'
    ): void;
    _onColumnScrollStopDragScrolling(
        e: SyntheticEvent<TouchEvent | MouseEvent>,
        startBy: 'mouse' | 'touch'
    ): void;
}

type TColumnScrollViewMixin = IView & IColumnScrollViewMixin;

export { IView as IAbstractView, IViewOptions as IAbstractViewOptions, TColumnScrollViewMixin };
