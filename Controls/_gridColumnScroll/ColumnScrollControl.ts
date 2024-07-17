/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
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
import {
    type TScrollIntoViewAlign,
    ENABLE_GRAPHIC_ACCELERATION_CSS_CLASS_NAME,
} from 'Controls/columnScrollReact';
import { QA_SELECTORS } from 'Controls/columnScrollReact';

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

        private _updateSizes(): void {
            // FIXME: Правка для обхода проблем с асинхронным обновлением размеров через resizeobserver.
            //  Разобраться как сделать правильно и почему ломается при уменьшении размеров.
            const scrollableWidth = this._container.querySelector(
                `[data-qa="${QA_SELECTORS.SCROLLABLE_CONTENT_PART_OBSERVER}"]`
            ).clientWidth;
            const viewPortWidth = this._container.querySelector(
                `[data-qa="${QA_SELECTORS.VIEWPORT_OBSERVER}"]`
            ).clientWidth;
            const startFixedWidth =
                this._container.querySelector(
                    `[data-qa="${QA_SELECTORS.START_FIXED_CONTENT_PART_OBSERVER}"]`
                )?.clientWidth || 0;
            const endFixedWidth =
                this._container.querySelector(
                    `[data-qa="${QA_SELECTORS.END_FIXED_CONTENT_PART_OBSERVER}"]`
                )?.clientWidth || 0;
            this._options.columnScrollUpdateSizes?.({
                viewPortWidth,
                startFixedWidth,
                endFixedWidth,
                contentWidth: startFixedWidth + scrollableWidth + endFixedWidth,
            });
        }

        horizontalScrollTo(position: number, smooth: boolean = false): void {
            if (this._options.columnScrollStartPosition <= position) {
                this._updateSizes();
            }
            // TODO: А точно тут нужно не columnScrollScrollIntoView?
            // Кто то имеет право скроллить без доскролла к границе колонки?
            this._options.setColumnScrollPosition(position, smooth);
        }

        horizontalScrollToElement(
            element: HTMLElement,
            align: TScrollIntoViewAlign = 'auto',
            smooth: boolean = false
        ): void {
            this._options.columnScrollScrollIntoView?.(element, align, smooth);
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
                // Когда-то прокидка уйдет, и конфигурация скролла колонок будет здесь.
                // Модель таблицы не должна знать про скролл, получается, должен быть миксин,
                // расширяющий модель.
                stickyColumnsCount:
                    typeof options.stickyColumnsCount === 'number' ? options.stickyColumnsCount : 1,
                endStickyColumnsCount:
                    !detection.isMobilePlatform && typeof options.endStickyColumnsCount === 'number'
                        ? options.endStickyColumnsCount
                        : 0,
                columnScrollSelectors: options.columnScrollSelectors,
                hasColumnScrollCustomAutoScrollTargets:
                    options.hasColumnScrollCustomAutoScrollTargets,
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

        protected _getBaseControlClasses(...args: unknown[]): string {
            let classes = super._getBaseControlClasses(...args);

            // Вешаем класс для включения GPU оптимизаций, лечим таким образом проблему
            // с белыми мерцающими и пропадающими блоками при скроллировании.
            // Хак основан на использовании transform и не может быть включен во
            // время скроллирования мышью, т.к. transform создает новый контекст наложения, а
            // скроллирование мышью работает через оверлей на весь экран с position: fixed.
            // При одновременном включении двух механизмов, оверлей будет по размеру с
            // таблицу(блок на котором включена оптимизация), а не с экран.
            if (!this._options.isDragScrollOverlayShown) {
                classes += ` ${ENABLE_GRAPHIC_ACCELERATION_CSS_CLASS_NAME}`;
            }

            return classes;
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
                this._options.columnScrollScrollIntoView?.(cell);
            }
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
