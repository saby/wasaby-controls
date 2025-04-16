/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { HoveredItem } from 'Controls/baseList';
import { BaseTreeControl, IBaseTreeControlOptions } from 'Controls/baseTree';
import {
    GridControl,
    IGridControlOptions,
    updateCollectionIfReactView,
    getCellIndexByEventTarget,
    GridRow,
    GridCollection as Collection,
    isGridCollection,
    IGridOptions,
} from 'Controls/grid';
import { TGroupNodeViewMode } from 'Controls/treeGridRender';
import { SyntheticEvent } from 'UI/Vdom';
import { Model } from 'Types/entity';

export interface ITreeGridOptions extends ITreeControlOptions, IGridOptions {
    nodeTypeProperty?: string;
    groupNodeViewMode?: TGroupNodeViewMode;
}

export interface ITreeGridControlOptions extends IBaseTreeControlOptions, IGridControlOptions {}

export class TreeGridControl<
    TOptions extends ITreeGridControlOptions = ITreeGridControlOptions,
> extends BaseTreeControl<TOptions> {
    protected _listViewModel: Collection;
    private _hoveredCellItem: Model;
    private _hoveredCellIndex: number;
    private _hoveredItemController: HoveredItem;

    constructor(...args: unknown[]) {
        super(...args);
        this._hoveredItemController = GridControl._initHoveredItemController(
            this._notify.bind(this)
        );
    }

    protected _beforeUpdate(
        newOptions: IGridControlOptions,
        contexts?: { workByKeyboard?: WorkByKeyboardContext }
    ) {
        super._beforeUpdate(newOptions, contexts);

        if (isGridCollection(this._listViewModel)) {
            this._doAfterReload(() => {
                this._listViewModel.setNodeFooter?.(newOptions);
                this._listViewModel.setGetNodeFooterProps?.(newOptions.getNodeFooterProps);
                this._listViewModel.setNodeFooterColspanCallback?.(
                    newOptions.nodeFooterColspanCallback
                );
            });
        }

        updateCollectionIfReactView(
            this._listViewModel,
            this._options,
            newOptions,
            this._doAfterReload.bind(this)
        );
    }

    _$react_componentDidUpdate(oldOptions: ITreeGridControlOptions): void {
        super._$react_componentDidUpdate(oldOptions);
        this._storedColumnsWidthsChanged = false;
    }

    protected _shouldRenderPreloadedDataRightAway(): boolean {
        // Если есть группировка, то нельзя сразу же рисовать загруженные записи, т.к. первая группа пропадет.
        return this.props.renderPreloadedDataRightAway !== false && !this.props.groupProperty;
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
        } else {
            // Индекс колонки считается тут с учётом множественного выбора. Но прикладникам нужен реальный номер колонки.
            const checkboxShift = +this._hasMultiSelect();
            resolvedColumnIndex -= checkboxShift;
        }

        super._onTagHoverHandler(event, item, resolvedColumnIndex);
    }

    protected _onItemClick(
        event: SyntheticEvent,
        contents: Model,
        originalEvent: SyntheticEvent<MouseEvent>
    ): boolean | void {
        return GridControl._handleGridItemClick.call(
            this,
            event,
            contents,
            originalEvent,
            super._onItemClick.bind(this)
        );
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

    protected _onResizerOffsetChanged(offset: number): void {
        super._onResizerOffsetChanged(offset);
        this._storedColumnsWidthsChanged = true;
    }

    protected _getViewClasses(): string {
        return `${super._getViewClasses()} controls-GridControl__viewContainer`;
    }

    protected _shouldHandleItemMouseUp(item): boolean {
        return super._shouldHandleItemMouseUp(item) && !item.$TGGR;
    }

    protected _shouldHandleItemMouseDown(item): boolean {
        return super._shouldHandleItemMouseDown(item) && !item.$TGGR;
    }

    protected _getSystemFooterStyles(): string {
        return '';
    }

    protected _itemMouseEnter(...args: Parameters<BaseTreeControl['_itemMouseEnter']>): void {
        const result = super._itemMouseEnter(...args);
        const [, item, e] = args;
        this._hoveredItemController.setHoveredItem(item, e);
        return result;
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
        this._hoveredItemController.setHoveredItem(null);
        this._setHoveredCell(null, null);
        return result;
    }

    private _setHoveredCell(event: SyntheticEvent<MouseEvent>, contents: Model | Model[]): void {
        GridControl._setHoveredCell.call(this, event, contents);
    }

    static '[Controls/treeGrid:TreeGridControl]': true = true;

    static getDefaultOptions(): Partial<ITreeGridControlOptions> {
        return {
            ...BaseTreeControl.getDefaultOptions(),
            ...GridControl.getDefaultOptions(),
        };
    }
}
