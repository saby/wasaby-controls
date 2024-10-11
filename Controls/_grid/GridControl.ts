/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import { BaseControl, IBaseControlOptions } from 'Controls/baseList';
import { TColumns, THeader, GridRow as Row, GridCollection as Collection } from 'Controls/baseGrid';
import { SyntheticEvent } from 'UI/Vdom';
import { Model } from 'Types/entity';
import { updateCollectionIfReactView } from './utils/updateCollectionfromProps';
import {
    correctEventTargetFF,
    getCellElementByEventTarget,
    getCellIndexByEventTarget,
} from './utils/DomUtils';
import { EDIT_ARROW_SELECTOR } from 'Controls/listVisualAspects';
import { GROUP_EXPANDER_SELECTOR } from 'Controls/display';

export interface IGridControlOptions extends IBaseControlOptions {
    columns: TColumns;
    header?: THeader;
}

export class GridControl<
    T extends IGridControlOptions = IGridControlOptions
> extends BaseControl<T> {
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

        this._listViewModel.setColspanGroup(
            !newOptions.columnScroll || !newOptions.isColumnScrollVisible
        );

        // Нельзя вызвать здесь один раз _doAfterReload, т.к. _options за время загрузки успеют перезаписаться
        // на newOptions и проверка на изменение будет возвращать false
        // Это аналог GridView._applyChangedOptionsToModel
        updateCollectionIfReactView(
            this._listViewModel,
            this._options,
            newOptions,
            this._doAfterReload.bind(this)
        );
    }

    protected _afterMount(options) {
        super._afterMount(options);
        this.setIsColumnScrollVisible(options.isColumnScrollVisible);
        this._listViewModel.setColspanGroup(
            !options.columnScroll || !options.isColumnScrollVisible
        );
    }

    protected _$react_componentDidUpdate(oldOptions: IGridControlOptions): void {
        super._$react_componentDidUpdate(oldOptions);
        this._storedColumnsWidthsChanged = false;
    }

    protected _shouldRenderPreloadedDataRightAway(): boolean {
        // Если есть группировка, то нельзя сразу же рисовать загруженные записи, т.к. первая группа пропадет.
        return this.props.renderPreloadedDataRightAway !== false && !this.props.groupProperty;
        // this.props.renderPreloadedDataIgnoringViewType
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
        contents: Model | string | boolean,
        originalEvent: SyntheticEvent<MouseEvent>,
        _columnIndex: number = undefined
    ): boolean | void {
        const contentsIsStringOrBoolean =
            typeof contents === 'string' || typeof contents === 'boolean';
        const key = contentsIsStringOrBoolean ? contents : contents.getKey();
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

        if (this._handleDelegatedCheckboxClick(event, contents, originalEvent)) {
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

    private _setHoveredCell(e: SyntheticEvent<MouseEvent>, contents: Model | Model[]): void {
        const item = contents instanceof Array ? contents[contents.length - 1] : contents;
        const cellSelector = '.controls-GridReact__cell';
        const hoveredCellIndex = getCellIndexByEventTarget(
            e,
            this._listViewModel,
            undefined,
            cellSelector
        );

        if (item !== this._hoveredCellItem || hoveredCellIndex !== this._hoveredCellIndex) {
            this._hoveredCellItem = item;
            this._hoveredCellIndex = hoveredCellIndex;
            let container = null;
            let hoveredCellContainer = null;
            if (e) {
                const target = correctEventTargetFF(e.nativeEvent.target);
                container = target.closest('.controls-ListView__itemV');
                hoveredCellContainer = getCellElementByEventTarget(target, cellSelector);
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
