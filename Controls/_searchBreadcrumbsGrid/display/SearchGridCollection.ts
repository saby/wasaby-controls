/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import { TreeGridCollection } from 'Controls/treeGrid';
import { Model } from 'Types/entity';
import { TemplateFunction } from 'UI/Base';
import SearchGridDataRow from './SearchGridDataRow';
import {
    ItemsFactory,
    itemsStrategy,
    CollectionEnumerator,
    getFlatNearbyItem,
} from 'Controls/display';
import { TreeItem, SearchStrategy, RootSeparatorStrategy } from 'Controls/baseTree';
import BreadcrumbsItemRow from './BreadcrumbsItemRow';
import { IOptions as ITreeGridOptions } from 'Controls/_treeGrid/display/TreeGridCollection';
import TreeGridDataRow from 'Controls/_treeGrid/display/TreeGridDataRow';
import { TSearchNavigationMode } from 'Controls/interface';

/**
 * Рекурсивно проверяет скрыт ли элемент сворачиванием родительских узлов
 * @param {TreeItem<T>} item
 */
function itemIsVisible<T extends Model>(item: TreeItem<T>): boolean {
    if (item['[Controls/treeGrid:TreeGridGroupDataRow]'] || item['[Controls/_display/GroupItem]']) {
        return true;
    }

    const parent = item.getParent();

    // корневой узел не может быть свернут
    if (!parent || parent.isRoot()) {
        return true;
    } else if (parent['[Controls/treeGrid:TreeGridGroupDataRow]'] && !parent.isExpanded()) {
        return false;
    }

    return itemIsVisible(parent);
}

export interface IOptions<S extends Model, T extends TreeGridDataRow<S>>
    extends ITreeGridOptions<S, T> {
    breadCrumbsMode?: 'row' | 'cell';
    searchNavigationMode?: TSearchNavigationMode;
    searchBreadCrumbsItemTemplate?: TemplateFunction | string;
}

export default class SearchGridCollection<
    S extends Model = Model,
    T extends SearchGridDataRow<S> = SearchGridDataRow<S>
> extends TreeGridCollection<S, T> {
    /**
     * @cfg Имя свойства элемента хлебных крошек, хранящее признак того, что этот элемент и путь до него должны быть
     * выделены в обособленную цепочку
     * @name Controls/_display/Search#dedicatedItemProperty
     */
    protected _$dedicatedItemProperty: string;

    protected _$searchBreadCrumbsItemTemplate: TemplateFunction;

    protected _$colspanBreadcrumbs: boolean;

    protected _$breadCrumbsMode: 'row' | 'cell';

    protected _$searchNavigationMode: TSearchNavigationMode;

    protected _$containerWidth: number;

    protected _$markBreadcrumbs: boolean;

    protected _$onBreadcrumbItemClick: (event: Event, item: Record) => void;

    protected _getCollectionFilter(): ReturnType<TreeGridCollection['_getCollectionFilter']> {
        return (contents, sourceIndex, item) => {
            return itemIsVisible(item);
        };
    }

    getHeaderConstructor(): string {
        return this.isFullGridSupport()
            ? 'Controls/grid:GridHeader'
            : 'Controls/grid:GridTableHeader';
    }

    getSearchBreadcrumbsItemTemplate(): TemplateFunction | string {
        return this._$searchBreadCrumbsItemTemplate;
    }

    createBreadcrumbsItem(options: object): BreadcrumbsItemRow {
        options.itemModule = 'Controls/searchBreadcrumbsGrid:BreadcrumbsItemRow';
        const item = this.createItem({
            ...options,
            owner: this,
            isReadonly: this._$searchNavigationMode === 'readonly',
            cellTemplate: this.getSearchBreadcrumbsItemTemplate(),
            markBreadcrumbs: this._$markBreadcrumbs,
            onBreadcrumbItemClick: this._$onBreadcrumbItemClick,
        });
        return item;
    }

    createRootSeparator(options: object): BreadcrumbsItemRow {
        options.itemModule = 'Controls/searchBreadcrumbsGrid:SearchSeparatorRow';
        const item = this.createItem({
            ...options,
            owner: this,
        });
        return item;
    }

    getContainerWidth(): number {
        return this._$containerWidth;
    }

    setContainerWidth(containerWidth: number): void {
        if (this._$containerWidth === containerWidth || containerWidth === undefined) {
            return;
        }
        this._$containerWidth = containerWidth;
        this._nextVersion();
        this._updateItemsProperty('setContainerWidth', this._$containerWidth, 'setContainerWidth');
    }

    setColspanBreadcrumbs(colspanBreadcrumbs: boolean): void {
        if (this._$colspanBreadcrumbs !== colspanBreadcrumbs) {
            this._$colspanBreadcrumbs = colspanBreadcrumbs;
            this._updateItemsProperty(
                'setColspanBreadcrumbs',
                this._$colspanBreadcrumbs,
                '[Controls/_baseTree/BreadcrumbsItem]'
            );
            this._nextVersion();
        }
    }

    setBreadCrumbsMode(breadCrumbsMode: 'row' | 'cell'): void {
        if (this._$breadCrumbsMode === breadCrumbsMode) {
            return;
        }

        this._$breadCrumbsMode = breadCrumbsMode;
        this._updateItemsProperty(
            'setBreadCrumbsMode',
            this._$breadCrumbsMode,
            '[Controls/_baseTree/BreadcrumbsItem]'
        );
        this._nextVersion();
    }

    protected _getNearbyItem(
        enumerator: CollectionEnumerator<T>,
        item: T,
        isNext: boolean,
        conditionProperty?: string
    ): T {
        return getFlatNearbyItem(enumerator, item, isNext, conditionProperty);
    }

    protected _hasItemsToCreateResults(): boolean {
        return this.getSourceCollection().getCount() > 1;
    }

    protected _getItemsFactory(): ItemsFactory<T> {
        const parent = super._getItemsFactory();

        return function TreeItemsFactory(options: any): T {
            options.colspanBreadcrumbs = this._$colspanBreadcrumbs;
            options.breadCrumbsMode = this._$breadCrumbsMode;
            return parent.call(this, options);
        };
    }

    protected _createComposer(): itemsStrategy.Composer<S, T> {
        const composer = super._createComposer();

        composer.append(SearchStrategy, {
            display: this,
            dedicatedItemProperty: this._$dedicatedItemProperty,
            treeItemDecoratorModule: 'Controls/searchBreadcrumbsGrid:TreeGridItemDecorator',
        });
        composer.append(RootSeparatorStrategy, {
            display: this,
        });

        return composer;
    }

    protected _changedParent(oldItem: T, newParentValue: boolean): boolean {
        const oldItemParent = oldItem.getParent();
        if (oldItemParent['[Controls/_baseTree/BreadcrumbsItem]']) {
            // Если родитель это хлебная крошка, то родителем записи будет последний элемент хлебной крошки
            const parents = oldItemParent.getContents() as Model[];
            const parent = parents[parents.length - 1];
            const oldValue = parent.getKey();
            return newParentValue !== oldValue;
        } else {
            return super._changedParent(oldItem, newParentValue);
        }
    }

    protected _reCountHierarchy(): void {
        const strategy = this.getStrategyInstance(SearchStrategy);
        strategy.reset();
        super._reCountHierarchy();
    }

    protected _recountHasNodeWithChildren(): void {
        // В поисковой модели не нужно выставлять флаг hasNodeWithChildren, т.к. это нужно только для экспандера
        // а экспандер в моделе с хлебными крошками не отображается
    }

    // Пересчитывать hasNode нужно, т.к. это знание так же участвует в расчете иерархических отступов,
    // которые должны быть для дочерних элементов скрытых узлов
    /* protected _recountHasNode(): void {
   }*/
}

Object.assign(SearchGridCollection.prototype, {
    '[Controls/searchBreadcrumbsGrid:SearchGridCollection]': true,
    _moduleName: 'Controls/searchBreadcrumbsGrid:SearchGridCollection',
    _itemModule: 'Controls/searchBreadcrumbsGrid:SearchGridDataRow',
    _$searchBreadCrumbsItemTemplate: 'Controls/searchBreadcrumbsGrid:SearchBreadcrumbsItemTemplate',
    _$breadCrumbsMode: 'row',
    _$dedicatedItemProperty: '',
    _$colspanBreadcrumbs: true,
    _$searchNavigationMode: 'open',
    _$containerWidth: null,
    _$markBreadcrumbs: false,
    _$onBreadcrumbItemClick: null,
});
