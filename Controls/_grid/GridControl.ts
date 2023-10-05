/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
import { BaseControl, IBaseControlOptions } from 'Controls/baseList';
import { TColumns } from 'Controls/_grid/display/interface/IColumn';
import { THeader } from 'Controls/_grid/display/interface/IHeaderCell';
import type Row from 'Controls/_grid/display/Row';
import { SyntheticEvent } from 'UI/Vdom';
import Collection from './display/Collection';
import { Model } from 'Types/entity';
import { isReactView, updateCollectionIfReactView } from './utils/PropsConverter';
import { correctEventTargetFF, getCellElementByEventTarget, getCellIndexByEventTarget } from './utils/DomUtils';
import { EDIT_ARROW_SELECTOR } from './RenderReact/EditArrowComponent';
import { GROUP_EXPANDER_SELECTOR } from './Render/GroupCellComponent';

export interface IGridControlOptions extends IBaseControlOptions {
    columns: TColumns;
    header?: THeader;
}

export class GridControl<T extends IGridControlOptions = IGridControlOptions> extends BaseControl<T> {
    protected _listViewModel: Collection;
    private _hoveredCellItem: Model;
    private _hoveredCellIndex: number;

    constructor(...args: unknown[]) {
        super(...args);
        this._doScrollUtil = this._doScrollUtil.bind(this);
    }

    protected _beforeUpdate(
        newOptions: IGridControlOptions,
        contexts?: { workByKeyboard?: WorkByKeyboardContext }
    ) {
        super._beforeUpdate(newOptions, contexts);

        // Нельзя вызвать здесь один раз _doAfterReload, т.к. _options за время загрузки успеют перезаписаться
        // на newOptions и проверка на изменение будет возвращать false
        updateCollectionIfReactView(
            this._listViewModel,
            this._options,
            newOptions,
            this._doAfterReload.bind(this)
        );
    }

    protected _$react_componentDidUpdate(oldOptions: IGridControlOptions): void {
        super._$react_componentDidUpdate(oldOptions);
        this._storedColumnsWidthsChanged = false;
    }

    protected _shouldRenderPreloadedDataRightAway(): boolean {
        // Если есть группировка, то нельзя сразу же рисовать загруженные записи, т.к. первая группа пропадет.
        return (
            this.props.renderPreloadedDataRightAway !== false &&
            !this.props.groupProperty &&
            isReactView(this.props)
        );
    }

    scrollToLeft(): void {
        this._children?.listView?.scrollToLeft?.();
    }

    scrollToRight(): void {
        this._children?.listView?.scrollToRight?.();
    }

    scrollToColumn(columnIndexOrKey: number | string): void {
        this._children?.listView?.scrollToColumn?.(columnIndexOrKey as number);
    }

    protected _onItemClick(
        event: SyntheticEvent,
        contents: Model,
        originalEvent: SyntheticEvent<MouseEvent>,
        _columnIndex: number = undefined
    ): boolean | void {
        const key = typeof contents === 'string' ? contents : contents.getKey();
        const item = this._listViewModel.getItemBySourceKey(key);
        if (event.target.closest(`.${GROUP_EXPANDER_SELECTOR}`)) {
            event.stopPropagation();
            return this._onGroupClick(event, contents, originalEvent, item);
        }
        const columnIndex = getCellIndexByEventTarget(originalEvent, this._listViewModel);

        const clickOnEditArrow = originalEvent.target.closest(`.${EDIT_ARROW_SELECTOR}`);
        if (!!clickOnEditArrow) {
            this._options.notifyCallback('editArrowClick', [contents]);
            event.stopPropagation();
            return;
        }

        // Проблема в том, что клик по action происходит раньше, чем itemClick.
        // Если мы нажмем на крестик, то состояние editing сбросится в false до itemClick.
        // Но запись перерисоваться не успеет, поэтому смотрим на класс.
        const targetItem = originalEvent.target.closest('.controls-ListView__itemV');
        const clickOnEditingItem =
            targetItem && targetItem.matches('.js-controls-ListView__item_editing');
        if (clickOnEditingItem) {
            event.stopPropagation();
            if (this._listViewModel.getEditingConfig()?.mode === 'cell') {
                const multiSelectOffset = +this._listViewModel.hasMultiSelectColumn();
                if (item.getEditingColumnIndex() !== columnIndex + multiSelectOffset) {
                    super._onItemClick(event, contents, originalEvent, columnIndex);
                }
            }
            return;
        }

        super._onItemClick(event, contents, originalEvent, columnIndex);
    }

    protected _itemMouseMove(
        ...args: Parameters<BaseControl['_itemMouseMove']>
    ): ReturnType<BaseControl['_itemMouseMove']> {
        const result = super._itemMouseMove(...args);
        const [, item, e] = args;
        if (!item['[Controls/_display/grid/GroupRow]']) {
            this._setHoveredCell(e, item.getContents());
        }
        return result;
    }

    protected _itemMouseLeave(
        ...args: Parameters<BaseControl['_itemMouseLeave']>
    ): ReturnType<BaseControl['_itemMouseLeave']> {
        const result = super._itemMouseLeave(...args);
        this._setHoveredCell(null, null);
        return result;
    }

    protected _onTagClickHandler(event: Event, item: Row<Model>, columnIndex: number): void {
        let resolvedColumnIndex = columnIndex;
        if (columnIndex === undefined) {
            resolvedColumnIndex = getCellIndexByEventTarget(event, this._listViewModel);
        }
        super._onTagClickHandler(event, item, resolvedColumnIndex);
    }

    protected _onTagHoverHandler(event: Event, item: Row<Model>, columnIndex: number): void {
        let resolvedColumnIndex = columnIndex;
        if (columnIndex === undefined) {
            resolvedColumnIndex = getCellIndexByEventTarget(event, this._listViewModel);
        }
        super._onTagHoverHandler(event, item, resolvedColumnIndex);
    }

    private _doScrollUtil(position: number): void {
        this._options.notifyCallback('doHorizontalScroll', [position, true], {
            bubbling: true,
        });
    }

    protected _onResizerOffsetChanged(offset: number): void {
        super._onResizerOffsetChanged(offset);
        this._storedColumnsWidthsChanged = true;
    }

    protected _getViewClasses(uniqueId: string): string {
        return `${super._getViewClasses(uniqueId)} controls-GridControl__viewContainer`;
    }

    protected _getSystemFooterStyles(): string {
        return '';
    }

    private _setHoveredCell(e: SyntheticEvent<MouseEvent>, item: Model): void {
        const cellSelector = this._options._isReactView ? '.controls-GridReact__cell' : undefined;
        const hoveredCellIndex = getCellIndexByEventTarget(e, this._listViewModel, undefined, cellSelector);

        if (item !== this._hoveredCellItem || hoveredCellIndex !== this._hoveredCellIndex) {
            this._hoveredCellItem = item;
            this._hoveredCellIndex = hoveredCellIndex;
            let container = null;
            let hoveredCellContainer = null;
            if (e) {
                const target = correctEventTargetFF(e.nativeEvent.target);
                container = target.closest('.controls-ListView__itemV');
                hoveredCellContainer = getCellElementByEventTarget(
                    target,
                    cellSelector
                );
            }
            this._options.notifyCallback('hoveredCellChanged', [
                item,
                container,
                hoveredCellIndex,
                hoveredCellContainer,
            ]);
        }
    }

    static '[Controls/grid:GridControl]': true = true;

    static getDefaultOptions(): Partial<IGridControlOptions> {
        return {
            ...BaseControl.getDefaultOptions(),
        };
    }
}
