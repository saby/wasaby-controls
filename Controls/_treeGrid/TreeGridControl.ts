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
} from 'Controls/grid';
import { SyntheticEvent } from 'UI/Vdom';

export interface ITreeGridControlOptions extends IBaseTreeControlOptions, IGridControlOptions {}

export class TreeGridControl<
    TOptions extends ITreeGridControlOptions = ITreeGridControlOptions
> extends BaseTreeControl<TOptions> {
    constructor(...args: unknown[]) {
        super(...args);
        this._doScrollUtil = this._doScrollUtil.bind(this);
    }

    protected _beforeUpdate(
        newOptions: IGridControlOptions,
        contexts?: { workByKeyboard?: WorkByKeyboardContext }
    ) {
        super._beforeUpdate(newOptions, contexts);

        // TODO после перезагрузки это надо делать
        updateCollectionIfReactView(this._listViewModel, this._options, newOptions);
        if (isReactView(newOptions)) {
            this._listViewModel.setNodeFooter(newOptions.nodeFooter);
            this._listViewModel.setNodeFooterColspanCallback(newOptions.nodeFooterColspanCallback);
        }
    }

    _$react_componentDidUpdate(oldOptions: ITreeGridControlOptions): void {
        super._$react_componentDidUpdate(oldOptions);
        this._storedColumnsWidthsChanged = false;
    }

    protected _shouldRenderPreloadedDataRightAway(): boolean {
        // Если есть группировка, то нельзя сразу же рисовать загруженные записи, т.к. первая группа пропадет.
        return !this.props.groupProperty && isReactView(this.props);
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

    scrollToLeft(): void {
        if (this._children.listView.scrollToLeft) {
            this._children.listView.scrollToLeft();
        }
    }

    scrollToRight(): void {
        if (this._children.listView.scrollToRight) {
            this._children.listView.scrollToRight();
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

    static '[Controls/treeGrid:TreeGridControl]': true = true;

    static getDefaultOptions(): Partial<ITreeGridControlOptions> {
        return {
            ...BaseTreeControl.getDefaultOptions(),
            ...GridControl.getDefaultOptions(),
        };
    }
}
