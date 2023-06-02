/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import { mixin } from 'Types/util';
import { TemplateFunction } from 'UI/Base';
import TreeGridDataRow, {
    IOptions as ITreeGridRowOptions,
} from './TreeGridDataRow';
import {
    CollectionItem,
    GridLadderUtil,
    IEditingConfig,
    IHasMoreData,
    IItemActionsTemplateConfig,
    ISessionItems,
    ItemsFactory,
} from 'Controls/display';
import { NODE_TYPE_PROPERTY_GROUP, Tree, TreeItem } from 'Controls/baseTree';
import { GridGroupRow, GridMixin, TColspanCallback } from 'Controls/grid';
import TreeGridFooterRow from './TreeGridFooterRow';
import {
    default as TreeGridGroupDataRow,
    IOptions as ITreeGridGroupDataRowOptions,
} from './TreeGridGroupDataRow';
import { Model as EntityModel, Model } from 'Types/entity';
import { IObservable } from 'Types/collection';
import { TGroupNodeVisibility } from '../interface/ITreeGrid';
import { ITreeGridOptions } from '../TreeGridView';
import NodeFooterStrategy from './itemsStrategy/NodeFooter';
import type { NodeFooterStrategy as NodeFooter } from 'Controls/baseTree';
import { IDirection } from 'Controls/_baseList/Controllers/ScrollController/ScrollController';
import type { INodeFooterConfig, INodeHeaderConfig } from 'Controls/gridReact';

/**
 * Рекурсивно проверяет скрыт ли элемент сворачиванием родительских узлов
 * @param {TreeItem<T>} item
 */
function itemIsVisible<T extends Model>(item: TreeItem<T>): boolean {
    if (
        item['[Controls/_display/GroupItem]'] ||
        item['[Controls/_baseTree/BreadcrumbsItem]']
    ) {
        return true;
    }

    const parent = item.getParent();
    // корневой узел не может быть свернут
    if (
        !parent ||
        parent['[Controls/_baseTree/BreadcrumbsItem]'] ||
        parent.isRoot()
    ) {
        return true;
    } else if (!parent.isExpanded()) {
        return false;
    }

    return itemIsVisible(parent);
}

/**
 * Коллекция, которая отображает элементы иерархии в виде таблицы
 * @private
 */
export default class TreeGridCollection<
    S extends Model = Model,
    T extends TreeGridDataRow<S> = TreeGridDataRow<S>
> extends mixin<Tree<S, T>, GridMixin<S, T>>(Tree, GridMixin) {
    readonly '[Controls/treeGrid:TreeGridCollection]': boolean;

    protected _$groupNodeVisibility: TGroupNodeVisibility;
    protected _$hasStickyGroup: boolean = false;
    protected _$nodeFooter: INodeFooterConfig[];
    protected _$nodeFooterColspanCallback: TColspanCallback;

    protected _$nodeHeader: INodeHeaderConfig[];
    protected _$nodeHeaderColspanCallback: TColspanCallback;

    constructor(options: ITreeGridOptions) {
        super(options);
        GridMixin.initMixin(this, options);
        this._publish('onColumnsConfigChanged');
    }

    protected _getCollectionFilter(): ReturnType<Tree['_getCollectionFilter']> {
        return (contents, sourceIndex, item) => {
            return itemIsVisible(item);
        };
    }

    // region NodeFooter

    setNodeFooter(nodeFooter: INodeFooterConfig[]): void {
        if (this._$nodeFooter !== nodeFooter) {
            this._$nodeFooter = nodeFooter;
            this._updateItemsProperty(
                'setGridColumnsConfig',
                nodeFooter,
                '[Controls/treeGrid:TreeGridNodeFooterRow]'
            );
            this._nextVersion();
        }
    }

    setNodeFooterColspanCallback(nodeFooterColspanCallback: TColspanCallback): void {
        if (this._$nodeFooterColspanCallback !== nodeFooterColspanCallback) {
            this._$nodeFooterColspanCallback = nodeFooterColspanCallback;
            this._updateItemsProperty(
                'setColspanCallback',
                nodeFooterColspanCallback,
                '[Controls/treeGrid:TreeGridNodeFooterRow]'
            );
            this._nextVersion();
        }
    }

    protected getNodeFooterStrategyCtor(): NodeFooterStrategy {
        return NodeFooterStrategy;
    }

    protected getNodeFooterStrategy(): NodeFooter {
        return this.getStrategyInstance(NodeFooterStrategy);
    }

    // endregion NodeFooter

    // region NodeHeader

    setNodeHeader(nodeHeader: INodeHeaderConfig[]): void {
        if (this._$nodeHeader !== nodeHeader) {
            this._$nodeHeader = nodeHeader;
            this._updateItemsProperty(
                'setGridColumnsConfig',
                nodeHeader,
                '[Controls/treeGrid:TreeGridNodeHeaderRow]'
            );
            this._nextVersion();
        }
    }

    hasNodeHeaderConfig(): boolean {
        return !!this._$nodeHeader;
    }

    setNodeHeaderColspanCallback(nodeHeaderColspanCallback: TColspanCallback): void {
        if (this._$nodeHeaderColspanCallback !== nodeHeaderColspanCallback) {
            this._$nodeHeaderColspanCallback = nodeHeaderColspanCallback;
            this._updateItemsProperty(
                'setColspanCallback',
                nodeHeaderColspanCallback,
                '[Controls/treeGrid:TreeGridNodeHeaderRow]'
            );
            this._nextVersion();
        }
    }

    // endregion NodeHeader

    setNodeTypeProperty(nodeTypeProperty: string): void {
        this._$nodeTypeProperty = nodeTypeProperty;
        this._updateGroupNodeVisibility();
        this._nextVersion();
    }

    setGroupNodeVisibility(groupNodeVisibility: TGroupNodeVisibility): void {
        this._$groupNodeVisibility = groupNodeVisibility;
        this._updateGroupNodeVisibility();
        this._nextVersion();
    }

    private _isGroupNodeVisible(record: Model): boolean {
        // Скрываем только группы.
        if (
            this._$groupNodeVisibility !== 'hasdata' ||
            record.get(this.getNodeTypeProperty()) !== NODE_TYPE_PROPERTY_GROUP
        ) {
            return true;
        }
        return !this.getMetaData().singleGroupNode;
    }

    private _updateGroupNodeVisibility(): void {
        const groupNodes: TreeGridGroupDataRow[] = [];
        this.each((item) => {
            if (item && item.GroupNodeItem) {
                groupNodes.push(item as unknown as TreeGridGroupDataRow<S>);
            }
        });
        if (groupNodes.length === 0) {
            return;
        }
        if (groupNodes.length === 1) {
            groupNodes[0].setIsHiddenGroup(
                !this._isGroupNodeVisible(groupNodes[0].getContents())
            );
        } else {
            groupNodes.forEach((groupNode) => {
                groupNode.setIsHiddenGroup(false);
            });
        }
    }

    // TODO duplicate code with GridCollection. Нужно придумать как от него избавиться.
    //  Проблема в том, что mixin не умеет объединять одинаковые методы, а логику Grid мы добавляем через mixin
    // region override

    setEmptyTemplate(emptyTemplate: TemplateFunction): boolean {
        const superResult = super.setEmptyTemplate(emptyTemplate);
        if (superResult) {
            if (this._$emptyTemplate) {
                if (this._$emptyGridRow) {
                    this._$emptyGridRow.setRowTemplate(this._$emptyTemplate);
                } else {
                    this._initializeEmptyRow();
                }
            } else {
                this._$emptyGridRow = undefined;
            }
        }
        return superResult;
    }

    setMultiSelectVisibility(visibility: string): void {
        const oldVisibility = this._$multiSelectVisibility;
        super.setMultiSelectVisibility(visibility);

        // Обновляем заголовки, итоги и тд только если мы показали или скрыли чекбокс.
        // Если поменяли вдимость с onhover на visible или обратно, то не надо ничего трогать,
        // потому что ячейка для столбца с multiSelect уже отрисована.
        if (
            oldVisibility !== visibility &&
            (oldVisibility === 'hidden' || visibility === 'hidden')
        ) {
            [
                this.getColgroup(),
                this.getHeader(),
                this.getResults(),
                this.getFooter(),
                this.getEmptyGridRow(),
            ].forEach((gridUnit) => {
                gridUnit?.setMultiSelectVisibility(visibility);
            });

            this._$colgroup?.reBuild();
        }
    }

    setActionsTemplateConfig(
        config: IItemActionsTemplateConfig,
        silent?: boolean
    ) {
        super.setActionsTemplateConfig(config, silent);
        if (this.getFooter()) {
            this.getFooter().setActionsTemplateConfig(config);
        }
    }

    setHasMoreData(hasMoreData: IHasMoreData): void {
        super.setHasMoreData(hasMoreData);
        if (this.getFooter()) {
            this.getFooter().setHasMoreData(hasMoreData);
        }
    }

    hasNodeFooterColumns(): boolean {
        return (
            !!this._$columns &&
            this._$columns.reduce((acc, column) => {
                return acc || !!column.nodeFooterTemplate;
            }, false) || !!this._$nodeFooter
        );
    }

    protected _reBuild(reset?: boolean): void {
        if (
            GridLadderUtil.isSupportLadder(this._$ladderProperties) &&
            !!this._$ladder
        ) {
            this._prepareLadder(this._$ladderProperties, this._$columns);
        }
        super._reBuild(reset);
        this._$colgroup?.reBuild();
    }

    setIndexes(start: number, stop: number, shiftDirection: IDirection): void {
        super.setIndexes(start, stop, shiftDirection);
        if (GridLadderUtil.isSupportLadder(this._$ladderProperties)) {
            this._prepareLadder(this._$ladderProperties, this._$columns);
            this._updateItemsLadder();
        }
        if (this.getHeader() && this.hasResizer()) {
            this.getHeader().setRowsCount(start, stop);
        }

        this._getItems().forEach((item: T) => {
            if (this._$nodeFooter && item['[Controls/treeGrid:TreeGridNodeFooterRow]']) {
                item.setColumnsConfig(this._$nodeFooter);
            } else if (this._$nodeHeader && item['[Controls/treeGrid:TreeGridNodeHeaderRow]']) {
                item.setColumnsConfig(this._$nodeHeader);
            } else {
                item.setColumnsConfig(this._$columns);
            }
        });
    }

    isLastItem(item: CollectionItem): boolean {
        // TODO Сделать возможным делать последний NodeFooter last, если он содержит данные
        //  Как можно проверить из кода - не ясно
        const enumerator = this._getUtilityEnumerator();

        // определяем через enumerator последнюю запись перед NodeFooter и её индекс
        enumerator.setPosition(this.getCount() - 1);
        let resultItemIndex = enumerator.getCurrentIndex();
        let resultItem = enumerator.getCurrent();
        while (
            resultItem &&
            resultItem['[Controls/treeGrid:TreeGridNodeFooterRow]']
        ) {
            enumerator.movePrevious();
            resultItemIndex = enumerator.getCurrentIndex();
            resultItem = enumerator.getCurrent();
        }
        return resultItemIndex === this.getIndex(item);
    }

    protected _handleAfterCollectionChange(
        changedItems: ISessionItems<T>[] & { properties?: string },
        changeAction?: string
    ): void {
        super._handleAfterCollectionChange(changedItems, changeAction);
        if (
            GridLadderUtil.isSupportLadder(this._$ladderProperties) &&
            changedItems?.properties !== 'selected'
        ) {
            this._prepareLadder(this._$ladderProperties, this._$columns);
            this._updateItemsLadder();
        }

        if (changeAction === IObservable.ACTION_RESET && this.getCount() > 0) {
            this._updateGroupNodeVisibility();
        }

        // Сбрасываем модель заголовка если его видимость зависит от наличия данных и текущее действие
        // это смена записей.
        const headerIsVisible = this._headerIsVisible(
            this._$header,
            this._$headerVisibility
        );
        if (changeAction === IObservable.ACTION_RESET && !headerIsVisible) {
            this._$headerModel = null;
        }

        this._updateHasStickyGroup();

        if (changeAction === IObservable.ACTION_RESET && !this._resultsIsVisible()) {
            this._$results = null;
        }
    }

    protected _updateHasStickyGroup(): void {
        const hasStickyGroup = this._hasStickyGroup();
        if (this._$hasStickyGroup !== hasStickyGroup) {
            this._$hasStickyGroup = hasStickyGroup;
            this._updateItemsProperty(
                'setHasStickyGroup',
                this._$hasStickyGroup,
                'LadderSupport'
            );
        }
    }

    protected _hasStickyGroup(): boolean {
        return !!(
            this.at(0) &&
            (this.at(0)['[Controls/_display/GroupItem]'] ||
                this.at(0)['[Controls/treeGrid:TreeGridGroupDataRow]']) &&
            !(
                this.at(0) as unknown as TreeGridGroupDataRow<S>
            ).isHiddenGroup() &&
            this._$stickyHeader
        );
    }

    protected _handleCollectionChangeAdd(): void {
        super._handleCollectionChangeAdd();
        this._updateGroupNodeVisibility();
    }

    protected _handleCollectionChangeRemove(): void {
        super._handleCollectionChangeRemove();
        if (this.getCount() > 0) {
            this._updateGroupNodeVisibility();
        }
    }

    protected _getItemsFactory(): ItemsFactory<T> {
        const superFactory = super._getItemsFactory();
        return this._itemsFactoryResolver.bind(this, superFactory);
    }

    protected _getGroupItemConstructor(): new () => GridGroupRow<T> {
        return GridGroupRow;
    }

    getAdditionalGroupConstructorParams() {
        return {
            ...super.getAdditionalGroupConstructorParams(),
            colspanGroup: this._$colspanGroup,
            gridColumnsConfig: this._$columns,
            columnsConfig: this._$columns,
        };
    }

    setEditing(editing: boolean): void {
        super.setEditing(editing);

        if (
            this._$headerModel &&
            !this._headerIsVisible(this._$header, this._$headerVisibility)
        ) {
            this._$headerModel = null;
        }
        this._nextVersion();
    }

    setEditingConfig(config: IEditingConfig): void {
        super.setEditingConfig(config);
        this._updateItemsProperty(
            'setEditingConfig',
            config,
            'setEditingConfig'
        );
    }

    protected _removeItems(start: number, count?: number): T[] {
        const result = super._removeItems(start, count);

        if (
            this._$headerModel &&
            !this._headerIsVisible(this._$header, this._$headerVisibility)
        ) {
            this._$headerModel = null;
        }

        return result;
    }

    // endregion

    // region HasNodeWithChildren

    protected _setDisplayExpanderPadding(newValue: boolean): void {
        super._setDisplayExpanderPadding(newValue);
        if (this.getFooter()) {
            this.getFooter().setDisplayExpanderPadding(newValue);
        }
        if (
            this.hasHeader() &&
            this.getHeader()['Controls/treeGrid:TreeGridHeader']
        ) {
            this.getHeader().setDisplayExpanderPadding(newValue);
        }
    }

    // endregion HasNodeWithChildren

    // region itemsFactoryResolver

    protected _itemsFactoryResolver(
        superFactory: ItemsFactory<T>,
        options?: ITreeGridRowOptions<S>
    ): ItemsFactory<T> {
        options.columnsConfig = this._$columns;
        options.gridColumnsConfig = this._$columns;
        options.colspanCallback = this._$colspanCallback;
        options.columnSeparatorSize = this._$columnSeparatorSize;
        options.rowSeparatorSize = this._$rowSeparatorSize;
        options.itemActionsPosition = this._$itemActionsPosition;
        options.hasStickyGroup = this._$hasStickyGroup;
        options.useSpacingColumn = this._$useSpacingColumn;
        options.hasMultiSelectColumn = this.hasMultiSelectColumn();
        options.getRowProps = this._$getRowProps;

        // Строит обычную фабрику
        const CollectionItemsFactory = (
            factoryOptions?: ITreeGridRowOptions<S>
        ): ItemsFactory<T> => {
            return superFactory.call(this, factoryOptions);
        };

        // Строит фабрику, которая работает с TreeGridGroupDataRow
        const GroupNodeFactory = (
            factoryOptions?: ITreeGridGroupDataRowOptions<S>
        ): ItemsFactory<T> => {
            factoryOptions.itemModule =
                'Controls/treeGrid:TreeGridGroupDataRow';
            factoryOptions.isHiddenGroup = !this._isGroupNodeVisible(
                factoryOptions.contents
            );
            return superFactory.call(this, factoryOptions);
        };

        const NodeFooterFactory = (
            factoryOptions?: ITreeGridGroupDataRowOptions<S>
        ): ItemsFactory<T> => {
            factoryOptions.rowTemplate = this._$nodeFooterTemplate;
            factoryOptions.gridColumnsConfig = this._$nodeFooter || this._$columns;
            factoryOptions.columnsConfig = this._$nodeFooter || this._$columns;
            factoryOptions.colspanCallback = this._$nodeFooterColspanCallback;
            return superFactory.call(this, factoryOptions);
        };

        const NodeHeaderFactory = (
            factoryOptions?: ITreeGridGroupDataRowOptions<S>
        ): ItemsFactory<T> => {
            factoryOptions.gridColumnsConfig = this._$nodeHeader || this._$columns;
            factoryOptions.columnsConfig = this._$nodeHeader || this._$columns;
            factoryOptions.colspanCallback = this._$nodeHeaderColspanCallback;
            return superFactory.call(this, factoryOptions);
        };

        if (options.itemModule === 'Controls/treeGrid:TreeGridNodeHeaderRow') {
            return NodeHeaderFactory.call(this, options);
        }
        if (options.itemModule === 'Controls/treeGrid:TreeGridNodeFooterRow') {
            return NodeFooterFactory.call(this, options);
        }

        if (
            this._$nodeTypeProperty &&
            options.contents &&
            typeof options.contents !== 'string' &&
            !Array.isArray(options.contents) &&
            options.contents.get(this._$nodeTypeProperty) ===
                NODE_TYPE_PROPERTY_GROUP
        ) {
            return GroupNodeFactory.call(this, options);
        }
        return CollectionItemsFactory.call(this, options);
    }

    // endregion itemsFactoryResolver

    protected _hasItemsToCreateResults(): boolean {
        const rootItems = this.getChildrenByRecordSet(this.getRoot());
        // Если единственный узел в списке - группа, показываем строку итогов
        // в зависимости от наличия его дочерних узлов
        if (
            rootItems.length === 1 &&
            this._$nodeTypeProperty &&
            rootItems[0].contents.get(this._$nodeTypeProperty) ===
                NODE_TYPE_PROPERTY_GROUP
        ) {
            return this.getChildrenByRecordSet(rootItems[0]).length > 1;
        }
        return rootItems.length > 1;
    }

    protected _initializeFooter(options: ITreeGridOptions): TreeGridFooterRow {
        if (!options.footer && !options.footerTemplate) {
            return;
        }

        return new TreeGridFooterRow({
            ...options,
            owner: this,
            columnsConfig: options.footer,
            gridColumnsConfig: options.columns,
            shouldAddFooterPadding: options.itemActionsPosition === 'outside',
            rowTemplate: options.footerTemplate,
            hasNodeWithChildren: this._hasNodeWithChildren,
            hasNode: this._hasNode,
            style: this.getStyle(),
            theme: this.getTheme(),
        });
    }

    getHeaderConstructor(): string {
        return this.isFullGridSupport()
            ? 'Controls/treeGrid:TreeGridHeader'
            : 'Controls/treeGrid:TreeGridTableHeader';
    }

    protected _initializeHeader(options: ITreeGridOptions): void {
        if (this.getExpanderSize()) {
            options.expanderSize = this.getExpanderSize();
        }
        options.displayExpanderPadding = this._displayExpanderPadding;
        super._initializeHeader(options);
    }

    protected _setMetaResults(metaResults: EntityModel): void {
        super._setMetaResults(metaResults);
        this._$results?.setMetaResults(metaResults);
    }
}

Object.assign(TreeGridCollection.prototype, {
    '[Controls/treeGrid:TreeGridCollection]': true,
    _moduleName: 'Controls/treeGrid:TreeGridCollection',
    _itemModule: 'Controls/treeGrid:TreeGridDataRow',
    _spaceItemModule: 'Controls/treeGrid:TreeGridSpaceRow',
    _nodeFooterModule: 'Controls/treeGrid:TreeGridNodeFooterRow',
    _nodeHeaderModule: 'Controls/treeGrid:TreeGridNodeHeaderRow',
    _$groupNodeVisibility: 'visible',
    _$nodeFooter: null,
    _$nodeFooterColspanCallback: null,
    _$nodeHeader: null,
    _$nodeHeaderColspanCallback: null,
});
