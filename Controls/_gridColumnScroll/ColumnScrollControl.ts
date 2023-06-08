import { Control } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';
import type {
    GridControl,
    IGridControlOptions,
    IGridCollectionOptions,
} from 'Controls/grid';
import type { TreeGridControl } from 'Controls/treeGrid';
import type { IHeaderConfig } from 'Controls/gridReact';
import type { IGridViewColumnScrollClearProps } from './render/view/interface';

import { patchHeader } from './render/utils/patchHeaderUtil';

interface IOptions
    extends IGridControlOptions,
        IGridViewColumnScrollClearProps {
    updateColumnScrollSizes: () => void;
    setColumnScrollPositionToPrevPage: () => void;
    setColumnScrollPositionToNextPage: () => void;
    setColumnScrollPositionToStart: () => void;
    setColumnScrollPositionToEnd: () => void;
    setColumnScrollPosition: (position: number, smooth: boolean) => void;
}

const getClass = <TOptions extends IOptions = IOptions>(
    BaseClass: TBaseControl<TOptions>
) => {
    return class GridColumnScrollControl<
        TControlOptions extends IOptions = IOptions
    > extends BaseClass<TControlOptions> {
        private _options: TControlOptions;

        scrollToLeft(): void {
            this._options.setColumnScrollPositionToStart?.();
        }

        scrollToRight(): void {
            this._options.setColumnScrollPositionToEnd?.();
        }

        horizontalScrollTo(position: number, smooth: boolean = false): void {
            this._options.setColumnScrollPosition?.(position, smooth);
        }

        protected _getModelOptions(
            options: TControlOptions
        ): IGridCollectionOptions {
            return {
                ...super._getModelOptions?.(options),
                // До полного перехода на горизонтальный скролл, сейчас модель работает по опции
                //  columnScrollReact чтобы не включать старое поведение, а новые react представления по
                //  columnScroll чтобы не менять публичное API.
                //  Будет только columnScroll после перехода.
                columnScroll: false,
                columnScrollReact: !!options.columnScroll,
                header: GridColumnScrollControl._getHeader(options),
            };
        }

        protected _beforeUpdate(
            newOptions: TControlOptions,
            ...args: unknown[]
        ): void {
            super._beforeUpdate?.(newOptions, ...args);

            if (this._options.columnScroll !== newOptions.columnScroll) {
                this._listViewModel.setColumnScroll(newOptions.columnScroll);
            }

            if (
                this._options.stickyColumnsCount !==
                newOptions.stickyColumnsCount
            ) {
                this._listViewModel.setStickyColumnsCount(
                    newOptions.stickyColumnsCount
                );
            }

            if (
                this._options.columnScrollNavigationPosition !==
                    newOptions.columnScrollNavigationPosition ||
                this._options.columnScrollViewMode !==
                    newOptions.columnScrollViewMode ||
                this._options.stickyColumnsCount !==
                    newOptions.stickyColumnsCount ||
                this._options.columns !== newOptions.columns ||
                this._options.header !== newOptions.header
            ) {
                this._listViewModel.setHeader(
                    GridColumnScrollControl._getHeader(newOptions)
                );
            }
        }

        protected _$react_componentDidUpdate(
            oldOptions: TControlOptions,
            ...args: unknown[]
        ): void {
            super._$react_componentDidUpdate?.(oldOptions, ...args);

            if (
                this._options.stickyColumnsCount !==
                oldOptions.stickyColumnsCount
            ) {
                this._options.updateColumnScrollSizes?.();
            }
        }

        protected _onContentResized(
            ...args: Parameters<GridControl['_onContentResized']>
        ): ReturnType<GridControl['_onContentResized']> {
            const result = super._onContentResized?.(...args);
            this._options.updateColumnScrollSizes?.();
            return result;
        }

        protected _viewportResizeHandler(
            ...args: Parameters<GridControl['_viewportResizeHandler']>
        ): ReturnType<GridControl['_viewportResizeHandler']> {
            const result = super._viewportResizeHandler?.(...args);
            this._options.updateColumnScrollSizes?.();
            return result;
        }

        protected _keyDownLeft(
            event: SyntheticEvent<KeyboardEvent>,
            canMoveMarker: boolean
        ): void {
            super._keyDownLeft(
                event,
                canMoveMarker && !event.nativeEvent.shiftKey
            );
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
            super._keyDownRight(
                event,
                canMoveMarker && !event.nativeEvent.shiftKey
            );
            if (event.nativeEvent.shiftKey) {
                // Пока контрол живет в окружении Wasaby и к контексту обращаться напрямую нет возможности,
                // вызываем метод из tsx прослойки совместимости, которая уже и работает с контекстом по
                // правилам реакта. После перевода контрола на tsx, код из прослойки будет здесь.
                this._options.setColumnScrollPositionToNextPage?.();
            }
        }

        static '[Controls/gridColumnScroll:ColumnScrollControl]': true = true;

        private static _getHeader(
            gridControlOptions: IOptions
        ): IHeaderConfig[] {
            return patchHeader(
                gridControlOptions.header,
                gridControlOptions.columns,
                gridControlOptions.stickyColumnsCount,
                {
                    columnScrollViewMode:
                        gridControlOptions.columnScrollViewMode || 'scrollbar',
                    columnScrollNavigationPosition:
                        gridControlOptions.columnScrollNavigationPosition,
                    hasCheckboxCell:
                        gridControlOptions.multiSelectVisibility !== 'hidden' &&
                        gridControlOptions.multiSelectPosition !== 'custom',
                }
            );
        }
    };
};

class AbstractControl<T> extends Control<T> {}
export { IOptions as IColumnScrollControlOptions };
export const AbstractColumnScrollControl = getClass(
    AbstractControl as TAbstractControl
);
export type IAbstractColumnScrollControl = typeof AbstractColumnScrollControl &
    typeof AbstractColumnScrollControl.prototype;
export { getClass };

type TAbstractControl<T extends IOptions = IOptions> = new (
    ...args: ConstructorParameters<typeof AbstractControl>
) => AbstractControl<T>;

type TGridControl<T extends IOptions = IOptions> = new (
    ...args: ConstructorParameters<typeof GridControl>
) => GridControl<T>;

type TTreeGridControl<T extends IOptions = IOptions> = new (
    ...args: ConstructorParameters<typeof TreeGridControl>
) => TreeGridControl<T>;

export type TBaseControl<T extends IOptions = IOptions> =
    | TGridControl<T>
    | TTreeGridControl<T>
    | TAbstractControl<T>;
