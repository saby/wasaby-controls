import { Control } from 'UI/Base';
import type { SyntheticEvent } from 'UICommon/Events';
import type { IItemsSizes } from 'Controls/baseList';
import type {
    GridControl,
    GridCollection,
    IGridControlOptions,
    IGridCollectionOptions,
} from 'Controls/grid';
import type { TreeGridControl, ITreeGridControlOptions } from 'Controls/treeGrid';
import type { ICompatibilityContext } from './WasabyGridContextCompatibilityConsumer';
import type { TNotDraggableJsSelector } from 'Controls/dragnDrop';
import type { IGridColumnScrollControlSelfProps } from './CommonInterface';

const NOT_DRAGGABLE_JS_SELECTOR: TNotDraggableJsSelector = 'controls-DragNDrop__notDraggable';

// FIXME: Этот селектор тоже должен импортироваться, нужно
//  понять откуда это правильнее сделать и перенести.
const ROW_JS_SELECTOR = 'controls-GridReact__row';

interface IOptions
    extends IGridControlOptions,
        ICompatibilityContext,
        IGridColumnScrollControlSelfProps {
}

const getClass = <TOptions extends IOptions = IOptions>(BaseClass: TBaseControl<TOptions>) => {
    return class GridColumnScrollControl<
        TControlOptions extends IOptions = IOptions
    > extends BaseClass<TControlOptions> {
        protected _options: TControlOptions;
        protected _listViewModel: GridCollection;
        protected _itemsSize: IItemsSizes;
        protected _startDragNDropCallback: GridControl['_startDragNDropCallback'];

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

        protected _getModelOptions(options: TControlOptions): IGridCollectionOptions {
            return {
                ...super._getModelOptions?.(options),
                // До полного перехода на горизонтальный скролл, сейчас модель работает по опции
                //  columnScrollReact чтобы не включать старое поведение, а новые react представления по
                //  columnScroll чтобы не менять публичное API.
                //  Будет только columnScroll после перехода.
                columnScroll: false,
                columnScrollReact: !!options.columnScroll,
            };
        }

        protected _getListVirtualScrollControllerOptions(
            ...args: Parameters<GridControl['_getListVirtualScrollControllerOptions']>
        ): ReturnType<GridControl['_getListVirtualScrollControllerOptions']> {
            const superResult = super._getListVirtualScrollControllerOptions(...args);
            return {
                ...superResult,
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

            if (this._options.stickyColumnsCount !== newOptions.stickyColumnsCount) {
                this._listViewModel.setStickyColumnsCount(newOptions.stickyColumnsCount);
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
