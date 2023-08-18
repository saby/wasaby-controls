import { Control } from 'UI/Base';
import { IItemsSizes, TLoadingTriggerSelector, extractWidthsForColumns } from 'Controls/baseList';
import { SCROLLABLE_VIEW_WRAPPER_CLASS_NAME } from './Selectors';
import { isEqual } from 'Types/object';
import { detection } from 'Env/Env';
import type { SyntheticEvent } from 'UICommon/Events';
import type {
    GridControl,
    GridCollection,
    IGridControlOptions,
    IGridCollectionOptions,
} from 'Controls/grid';
import type { TColumnKey, TColumnWidth } from 'Controls/gridReact';
import type { TreeGridControl, ITreeGridControlOptions } from 'Controls/treeGrid';
import type { ICompatibilityContext } from './WasabyGridContextCompatibilityConsumer';
import type { TNotDraggableJsSelector } from 'Controls/dragnDrop';
import type { IGridColumnScrollControlSelfProps } from './CommonInterface';
import type { IViewPortSizesParams } from '../_baseList/BaseControl';

const NOT_DRAGGABLE_JS_SELECTOR: TNotDraggableJsSelector = 'controls-DragNDrop__notDraggable';

const LOADING_TRIGGER_SELECTOR: `.${typeof SCROLLABLE_VIEW_WRAPPER_CLASS_NAME} ${TLoadingTriggerSelector}` = `.${SCROLLABLE_VIEW_WRAPPER_CLASS_NAME} .controls-BaseControl__loadingTrigger`;

// FIXME: Эти селекторы тоже должны импортироваться, нужно
//  понять откуда это правильнее сделать и перенести.
const ROW_JS_SELECTOR = 'controls-GridReact__row';
const CELL_JS_SELECTOR = 'js-controls-Grid__row-cell';

interface IOptions
    extends IGridControlOptions,
        ICompatibilityContext,
        IGridColumnScrollControlSelfProps {}

const getClass = <TOptions extends IOptions = IOptions>(BaseClass: TBaseControl<TOptions>) => {
    return class GridColumnScrollControl<
        TControlOptions extends IOptions = IOptions
    > extends BaseClass<TControlOptions> {
        protected _options: TControlOptions;
        protected _listViewModel: GridCollection;
        protected _itemsSize: IItemsSizes;
        protected _startDragNDropCallback: GridControl['_startDragNDropCallback'];
        protected _storedColumnsWidths?: Record<TColumnKey, TColumnWidth>;

        protected _contentWidth?: number;

        constructor(...args: ConstructorParameters<TBaseControl<TOptions>>) {
            super(...args);

            const props = args[0] as TControlOptions;

            if (props.setStartDragNDropCallback && props.itemsDragNDrop) {
                props.setStartDragNDropCallback(this._startDragNDropCallback);
            }

            if (props.setCanStartDragNDropCallback) {
                props.setCanStartDragNDropCallback((target: HTMLElement) => {
                    return (
                        !target.closest(`.${NOT_DRAGGABLE_JS_SELECTOR}`) &&
                        !!target.closest(`.${ROW_JS_SELECTOR}`)
                    );
                });
            }
        }

        scrollToLeft(smooth: boolean = false): void {
            this._options.setColumnScrollPositionToStart(smooth);
        }

        scrollToRight(smooth: boolean = false): void {
            this._options.setColumnScrollPositionToEnd(smooth);
        }

        horizontalScrollTo(position: number, smooth: boolean = false): void {
            this._options.setColumnScrollPosition(position, smooth);
        }

        horizontalScrollToElement(element: HTMLElement): void {
            this._horizontalScrollToElement(element);
        }

        protected _getModelOptions(options: TControlOptions): IGridCollectionOptions {
            return {
                ...super._getModelOptions?.(options),
                // До полного перехода на горизонтальный скролл, сейчас модель работает по опции
                //  columnScrollReact чтобы не включать старое поведение, а новые react представления по
                //  columnScroll чтобы не менять публичное API.
                //  Будет только columnScroll после перехода.
                columnScroll: false,
                columnScrollReact: !!options.columnScroll,

                // На самом деле, опции для конструктора модели пролетают просто скоупом, через
                // {...options} в BaseControl::_createNewModel.
                // Наличие этого кода сейчас функционально смысла не имеет, оно лишь дает понимание
                // как опции оказываются в модели.
                // Когда-то это уйдет, и конфигурация скролла колонок будет здесь.
                // Модель таблицы не должна знать про гор скролл, получается, должен быть миксин,
                // расширяющий модель.
                stickyColumnsCount: typeof options.stickyColumnsCount === 'number' ? options.stickyColumnsCount : 1,
                endStickyColumnsCount: !detection.isMobilePlatform && typeof options.endStickyColumnsCount === 'number' ? options.endStickyColumnsCount : 0,
                columnScrollSelectors: options.columnScrollSelectors,
            };
        }

        protected _getListVirtualScrollControllerOptions(
            ...args: Parameters<GridControl['_getListVirtualScrollControllerOptions']>
        ): ReturnType<GridControl['_getListVirtualScrollControllerOptions']> {
            const superResult = super._getListVirtualScrollControllerOptions(...args);
            return {
                ...superResult,
                triggersQuerySelector: LOADING_TRIGGER_SELECTOR,
                itemsSizesUpdatedCallback: (sizes: IItemsSizes) => {
                    superResult?.itemsSizesUpdatedCallback?.(sizes);
                    this._itemsSize = sizes;
                },
            };
        }

        protected _beforeUpdate(newOptions: TControlOptions, ...args: unknown[]): void {
            super._beforeUpdate?.(newOptions, ...args);

            if (this._options.resizerVisibility !== newOptions.resizerVisibility) {
                this._listViewModel.setResizerVisibility(newOptions.resizerVisibility);
            }

            if (this._options.columnScroll !== newOptions.columnScroll) {
                this._listViewModel.setColumnScroll(newOptions.columnScroll);
            }

            if (
                this._options.stickyColumnsCount !== newOptions.stickyColumnsCount ||
                this._options.endStickyColumnsCount !== newOptions.endStickyColumnsCount
            ) {
                this._listViewModel.setStickyColumnsCount(
                    newOptions.stickyColumnsCount,
                    newOptions.endStickyColumnsCount
                );
            }

            if (this._options.columnScrollViewMode !== newOptions.columnScrollViewMode) {
                this._listViewModel.setColumnScrollViewMode(newOptions.columnScrollViewMode);
            }

            if (
                this._options.itemsDragNDrop !== newOptions.itemsDragNDrop &&
                newOptions.setStartDragNDropCallback
            ) {
                newOptions.setStartDragNDropCallback(
                    newOptions.itemsDragNDrop ? this._startDragNDropCallback : undefined
                );
            }

            if (
                this._options.columnScrollNavigationPosition !==
                newOptions.columnScrollNavigationPosition
            ) {
                this._listViewModel.setColumnScrollNavigationPosition(
                    newOptions.columnScrollNavigationPosition
                );
            }

            if (this._options.columns !== newOptions.columns && this._storedColumnsWidths) {
                const newWidths = extractWidthsForColumns(
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    newOptions,
                    this._storedColumnsWidths,
                    this._listViewModel
                );
                if (!isEqual(this._listViewModel.getColumnsWidths(), newWidths)) {
                    this._listViewModel.setColumnsWidths(newWidths);
                }
            }
        }

        protected _onViewPortResized(
            oldSizes: IViewPortSizesParams,
            newSizes: IViewPortSizesParams
        ) {
            super._onViewPortResized(oldSizes, newSizes);

            if (oldSizes.width !== newSizes.width && this._contentWidth !== 0) {
                this._options.columnScrollUpdateSizes?.({
                    viewPortWidth: newSizes.width,
                    contentWidth: this._contentWidth,
                });
            }
        }

        protected _keyDownLeft(event: SyntheticEvent<KeyboardEvent>, canMoveMarker: boolean): void {
            super._keyDownLeft(event, canMoveMarker && !event.nativeEvent.shiftKey);
            if (event.nativeEvent.shiftKey) {
                // Пока контрол живет в окружении Wasaby и к контексту обращаться напрямую нет возможности,
                // вызываем метод из tsx прослойки совместимости, которая уже и работает с контекстом по
                // правилам реакта. После перевода контрола на tsx, код из прослойки будет здесь.
                this._options.setColumnScrollPositionToPrevPage?.();
            }
        }

        protected _keyDownRight(
            event: SyntheticEvent<KeyboardEvent>,
            canMoveMarker: boolean
        ): void {
            super._keyDownRight(event, canMoveMarker && !event.nativeEvent.shiftKey);
            if (event.nativeEvent.shiftKey) {
                // Пока контрол живет в окружении Wasaby и к контексту обращаться напрямую нет возможности,
                // вызываем метод из tsx прослойки совместимости, которая уже и работает с контекстом по
                // правилам реакта. После перевода контрола на tsx, код из прослойки будет здесь.
                this._options.setColumnScrollPositionToNextPage?.();
            }
        }

        protected _beforeRowActivated(target: HTMLElement): void {
            let cell: HTMLElement = target.closest(`.${CELL_JS_SELECTOR}`);

            if (!cell && target.className.indexOf(CELL_JS_SELECTOR) !== -1) {
                cell = target;
            }

            if (cell) {
                this._horizontalScrollToElement(cell);
            }
        }

        private _horizontalScrollToElement(target: HTMLElement): void {
            const hiddenOffset = this._getElementHiddenOffset(target);
            if (hiddenOffset !== 0) {
                this._options.setColumnScrollPosition?.(
                    this._options.getColumnScrollPosition() + hiddenOffset
                );
            }
        }

        private _getElementHiddenOffset(target: HTMLElement): number {
            const viewRect = target
                .closest('.controls-GridReact__view_columnScroll')
                .getBoundingClientRect();
            const targetRect = target.getBoundingClientRect();

            const leftElementOffset = Math.floor(
                targetRect.left -
                    viewRect.left -
                    this._options.getColumnScrollWidths().startFixedWidth
            );

            if (leftElementOffset < 0) {
                return leftElementOffset;
            }

            const rightElementOffset = Math.floor(viewRect.right - targetRect.right);

            if (rightElementOffset < 0) {
                return rightElementOffset * -1;
            }

            return 0;
        }

        static '[Controls/gridColumnScroll:ColumnScrollControl]': true = true;
    };
};

class AbstractControl<T> extends Control<T> {}

export { IOptions as IColumnScrollControlOptions };
export const AbstractColumnScrollControl = getClass(AbstractControl as TAbstractControl);
export type IAbstractColumnScrollControl = typeof AbstractColumnScrollControl &
    typeof AbstractColumnScrollControl.prototype;
export { getClass };

type TAbstractControl<T extends IOptions = IOptions> = new (
    ...args: ConstructorParameters<typeof AbstractControl>
) => AbstractControl<T>;

type TGridControl<T extends IOptions = IOptions> = new (
    ...args: ConstructorParameters<typeof GridControl>
) => GridControl<T>;

type TTreeGridControl<
    T extends IOptions & ITreeGridControlOptions = IOptions & ITreeGridControlOptions
> = new (...args: ConstructorParameters<typeof TreeGridControl>) => TreeGridControl<T>;

export type TBaseControl<T extends IOptions = IOptions> =
    | TGridControl<T>
    | TTreeGridControl<T & ITreeGridControlOptions>
    | TAbstractControl<T>;
