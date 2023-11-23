/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import { getKey } from 'Controls/baseList';
import { BaseTreeControl, IBaseTreeControlOptions } from 'Controls/baseTree';
import {
    GridControl,
    IGridControlOptions,
    updateCollectionIfReactView,
    isReactView,
    getCellIndexByEventTarget,
    GridRow,
    EDIT_ARROW_SELECTOR,
    GridCollection as Collection,
    correctEventTargetFF,
    getCellElementByEventTarget,
} from 'Controls/grid';
import { SyntheticEvent } from 'UI/Vdom';
import { Model } from 'Types/entity';

export interface ITreeGridControlOptions extends IBaseTreeControlOptions, IGridControlOptions {}

export class TreeGridControl<
    TOptions extends ITreeGridControlOptions = ITreeGridControlOptions
> extends BaseTreeControl<TOptions> {
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

        updateCollectionIfReactView(
            this._listViewModel,
            this._options,
            newOptions,
            this._doAfterReload.bind(this)
        );
        if (isReactView(newOptions)) {
            this._doAfterReload(() => {
                this._listViewModel.setNodeFooter(newOptions.nodeFooter);
                this._listViewModel.setNodeFooterColspanCallback(
                    newOptions.nodeFooterColspanCallback
                );
            });
        }
    }

    _$react_componentDidUpdate(oldOptions: ITreeGridControlOptions): void {
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

    protected _onTagClickHandler(event: Event, item: GridRow<Model>, columnIndex: number): void {
        let resolvedColumnIndex = columnIndex;
        if (columnIndex === undefined) {
            resolvedColumnIndex = getCellIndexByEventTarget(event, this._listViewModel);
        }
        super._onTagClickHandler(event, item, resolvedColumnIndex);
    }

    protected _onTagHoverHandler(event: Event, item: GridRow<Model>, columnIndex: number): void {
        let resolvedColumnIndex = columnIndex;
        if (columnIndex === undefined) {
            resolvedColumnIndex = getCellIndexByEventTarget(event, this._listViewModel);
        }
        super._onTagHoverHandler(event, item, resolvedColumnIndex);
    }

    protected _onItemClick(
        event: SyntheticEvent,
        contents: Model,
        originalEvent: SyntheticEvent<MouseEvent>,
        _columnIndex: number = undefined
    ): boolean | void {
        const item = this._listViewModel.getItemBySourceKey(getKey(contents));
        const columnIndex = getCellIndexByEventTarget(originalEvent, this._listViewModel);

        const clickOnEditArrow = originalEvent.target.closest(`.${EDIT_ARROW_SELECTOR}`);
        if (!!clickOnEditArrow) {
            this._notify('editArrowClick', [contents]);
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

    scrollToLeft(smooth?: boolean): void {
        if (this._children.listView.scrollToLeft) {
            this._children.listView.scrollToLeft(smooth);
        }
    }

    scrollToRight(smooth?: boolean): void {
        if (this._children.listView.scrollToRight) {
            this._children.listView.scrollToRight(smooth);
        }
    }

    scrollToColumn(columnIndexOrKey: number | string): void {
        if (this._children.listView.scrollToColumn) {
            this._children.listView.scrollToColumn(columnIndexOrKey as number);
        }
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

    protected _getViewClasses(): string {
        return `${super._getViewClasses()} controls-GridControl__viewContainer`;
    }

    protected _shouldHandleItemMouseUp(item): boolean {
        return (
            super._shouldHandleItemMouseUp(item) &&
            !item['[Controls/treeGrid:TreeGridGroupDataRow]']
        );
    }

    protected _shouldHandleItemMouseDown(item): boolean {
        return (
            super._shouldHandleItemMouseDown(item) &&
            !item['[Controls/treeGrid:TreeGridGroupDataRow]']
        );
    }

    protected _getSystemFooterStyles(): string {
        return '';
    }

    protected _itemMouseMove(
        ...args: Parameters<BaseTreeControl['_itemMouseMove']>
    ): ReturnType<BaseTreeControl['_itemMouseMove']> {
        const result = super._itemMouseMove(...args);
        const [, item, e] = args;
        this._setHoveredCell(e, item.getContents());
        return result;
    }

    protected _itemMouseLeave(
        ...args: Parameters<BaseTreeControl['_itemMouseLeave']>
    ): ReturnType<BaseTreeControl['_itemMouseLeave']> {
        const result = super._itemMouseLeave(...args);
        this._setHoveredCell(null, null);
        return result;
    }

    private _setHoveredCell(e: SyntheticEvent<MouseEvent>, contents: Model | Model[]): void {
        const item = contents instanceof Array ? contents[contents.length - 1] : contents;
        const cellSelector = this._options._isReactView ? '.controls-GridReact__cell' : undefined;
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

    static '[Controls/treeGrid:TreeGridControl]': true = true;

    static getDefaultOptions(): Partial<ITreeGridControlOptions> {
        return {
            ...BaseTreeControl.getDefaultOptions(),
            ...GridControl.getDefaultOptions(),
        };
    }
}
