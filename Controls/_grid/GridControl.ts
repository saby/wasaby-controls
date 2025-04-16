/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import { BaseControl, HoveredItem, IBaseControlOptions } from 'Controls/baseList';
import { GridRow as Row, GridCollection as Collection, IGridOptions } from 'Controls/gridDisplay';
import { SyntheticEvent } from 'UI/Vdom';
import { Model } from 'Types/entity';
import { updateCollectionIfReactView } from './utils/updateCollectionfromProps';
import {
    correctEventTargetFF,
    getCellElementByEventTarget,
    getCellIndexByEventTarget,
} from './utils/DomUtils';
import { EDIT_ARROW_SELECTOR } from 'Controls/listsCommonLogic';
import { CollectionItem, GROUP_EXPANDER_SELECTOR } from 'Controls/display';

type TItemClickCB = (
    event: SyntheticEvent,
    contents: Model | string | boolean,
    originalEvent: SyntheticEvent<MouseEvent>,
    columnIndex?: number
) => boolean | undefined;

type TGroupClickCB = (
    e: Event,
    groupId: string,
    baseEvent: MouseEvent,
    dispItem: CollectionItem
) => void;

interface IHandleGridItemClickProps {
    event: SyntheticEvent;
    originalEvent: SyntheticEvent<MouseEvent>;
    contents: Model | string | boolean;
    collection: Collection;
    item?: CollectionItem;
    columnIndex?: number;
    itemClickCB: TItemClickCB;
    groupClickCB: TGroupClickCB;
    notifyCallback: Function;
}

export interface IGridControlOptions extends IGridOptions, IBaseControlOptions {}

export class GridControl<
    T extends IGridControlOptions = IGridControlOptions,
> extends BaseControl<T> {
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

    protected _itemMouseEnter(...args: Parameters<BaseControl['_itemMouseEnter']>): void {
        const result = super._itemMouseEnter(...args);
        const [, item, e] = args;
        this._hoveredItemController.setHoveredItem(item, e);
        return result;
    }

    protected _itemMouseMove(
        ...args: Parameters<BaseControl['_itemMouseMove']>
    ): ReturnType<BaseControl['_itemMouseMove']> {
        const result = super._itemMouseMove(...args);
        const [, item, e] = args;
        if (!item.$GGR) {
            this._setHoveredCell(e, item.getContents());
        }
        return result;
    }

    protected _itemMouseLeave(
        ...args: Parameters<BaseControl['_itemMouseLeave']>
    ): ReturnType<BaseControl['_itemMouseLeave']> {
        const result = super._itemMouseLeave(...args);
        this._setHoveredCell(null, null);
        this._hoveredItemController.setHoveredItem(null);
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
        } else {
            // Индекс колонки считается тут с учётом множественного выбора. Но прикладникам нужен реальный номер колонки.
            const checkboxShift = +this._hasMultiSelect();
            resolvedColumnIndex -= checkboxShift;
        }
        super._onTagHoverHandler(event, item, resolvedColumnIndex);
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

    private _setHoveredCell(event: SyntheticEvent<MouseEvent>, contents: Model | Model[]): void {
        GridControl._setHoveredCell.call(this, event, contents);
    }

    static '[Controls/grid:GridControl]': true = true;

    // region shared static methods

    static _initHoveredItemController(notifyCallback: Function): HoveredItem {
        return new HoveredItem((data) => {
            notifyCallback('hoveredItemChanged', data);
        });
    }

    private static _handleGroupClick(props: IHandleGridItemClickProps) {
        const { event, groupClickCB, contents, originalEvent, item } = props;
        // groupClickCB предназначен только для клика по группе в плоском списке
        // И не должен использоваться для раскрытия узлов деорева в виде группы.
        if (
            item?.['[Controls/_display/GroupItem]'] &&
            event.target.closest(`.${GROUP_EXPANDER_SELECTOR}`)
        ) {
            event.stopPropagation();
            groupClickCB(event, contents, originalEvent, item);
            return true;
        }
    }

    private static _handleEditArrowClick(props: IHandleGridItemClickProps) {
        const { event, notifyCallback, contents, originalEvent } = props;
        const clickOnEditArrow = originalEvent.target.closest(`.${EDIT_ARROW_SELECTOR}`);
        if (!!clickOnEditArrow) {
            notifyCallback('editArrowClick', [contents]);
            event.stopPropagation();
            return true;
        }
    }

    /* Клик по action происходит раньше, чем itemClick.
    Если мы нажмем на крестик, то состояние editing сбросится в false до itemClick.
    Но запись перерисоваться не успеет, поэтому смотрим на класс. */
    private static _handleEditingItemClick(props: IHandleGridItemClickProps) {
        const { event, collection, originalEvent, itemClickCB, item, contents, columnIndex } =
            props;
        const targetItem = originalEvent.target.closest('.controls-ListView__itemV');
        const clickOnEditingItem =
            targetItem && targetItem.matches('.js-controls-ListView__item_editing');
        if (clickOnEditingItem) {
            event.stopPropagation();
            if (collection.getEditingConfig()?.mode === 'cell') {
                const multiSelectOffset = +collection.hasMultiSelectColumn();
                if (item.getEditingColumnIndex() !== columnIndex + multiSelectOffset) {
                    itemClickCB(event, contents, originalEvent, columnIndex);
                }
            }
            return true;
        }
    }

    static _handleGridItemClick(
        event: SyntheticEvent,
        contents: Model | string | boolean,
        originalEvent: SyntheticEvent<MouseEvent>,
        superItemClickCallback: TItemClickCB
    ): boolean | undefined {
        const commonHandlersProps: IHandleGridItemClickProps = {
            event,
            contents,
            originalEvent,
            collection: this._listViewModel,
            groupClickCB: this._onGroupClick.bind(this),
            notifyCallback: this._options.notifyCallback?.bind(this),
            itemClickCB: superItemClickCallback,
        };

        const contentsIsNotPrimitive = Boolean(contents?.getKey);
        const key = contentsIsNotPrimitive ? contents.getKey() : contents;
        commonHandlersProps.item = commonHandlersProps.collection.getItemBySourceKey(key);

        // Если добавляется новая запись, то по ключу в оригинальной коллекциио она очевидно не будет найдена.
        if (commonHandlersProps.item === null) {
            commonHandlersProps.item = commonHandlersProps.collection.getItemBySourceItem(contents);
        }

        let rowSelector = '.controls-ListView__itemV';
        if (event.target.closest('.js-ControlsLists-dynamicGrid__dynamicCellsWrapper')) {
            rowSelector = '.js-ControlsLists-dynamicGrid__dynamicCellsWrapper';
        }

        commonHandlersProps.columnIndex = getCellIndexByEventTarget(
            originalEvent,
            commonHandlersProps.collection,
            rowSelector
        );

        // Не вызываем логику ItemClick из BaseControl, если
        // a. Кликнули в чекбокс и обработали клик
        // б. Кликнули по заголовку группы и обработали клик
        // в. Кликнули по стрелке редактирования и обработали клик
        // г. Кликнули по редактируемой записи и обработали клик
        // Код обработчиков вынесен в отдельные функции, которые возвращают true, если произшла обработка:
        if (
            this._handleCheckboxClick.call(this, event, contents, originalEvent) ||
            GridControl._handleGroupClick(commonHandlersProps) ||
            GridControl._handleEditArrowClick(commonHandlersProps) ||
            GridControl._handleEditingItemClick(commonHandlersProps)
        ) {
            return;
        }

        return superItemClickCallback(
            event,
            contents,
            originalEvent,
            commonHandlersProps.columnIndex
        );
    }

    static _setHoveredCell(event: SyntheticEvent<MouseEvent>, contents: Model | Model[]) {
        const item = contents instanceof Array ? contents[contents.length - 1] : contents;
        const cellSelector = '.controls-GridReact__cell';
        const hoveredCellIndex = getCellIndexByEventTarget(
            event,
            this._listViewModel,
            undefined,
            cellSelector
        );

        if (item !== this._hoveredCellItem || hoveredCellIndex !== this._hoveredCellIndex) {
            this._hoveredCellItem = item;
            this._hoveredCellIndex = hoveredCellIndex;
            let container = null;
            let hoveredCellContainer = null;
            if (event) {
                const target = correctEventTargetFF(event.nativeEvent.target);
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

    static getDefaultOptions(): Partial<IGridControlOptions> {
        return {
            ...BaseControl.getDefaultOptions(),
        };
    }
}
