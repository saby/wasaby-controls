/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import SearchStrategy from './strategies/Search';
import RootSeparatorStrategy from './strategies/RootSeparator';
import { Model } from 'Types/entity';
import TreeItem from './TreeItem';
import Tree from './Tree';
import { itemsStrategy } from 'Controls/display';
import BreadcrumbsItem, {
    IOptions as IBreadcrumbsItemOptions,
} from './BreadcrumbsItem';
import RootSeparatorItem, {
    IOptions as IRootSeparatorOptions,
} from './RootSeparatorItem';

export interface IOptions<S, T> {
    dedicatedItemProperty?: string;
}

/**
 * Проекция для режима поиска. Объединяет развернутые узлы в один элемент с "хлебной крошкой" внутри.
 * @extends Controls/_display/Tree
 * @public
 */
export default class Search<
    S extends Model = Model,
    T extends TreeItem<S> = TreeItem<S>
> extends Tree<S, T> {
    /**
     * @cfg Имя свойства элемента хлебных крошек, хранящее признак того, что этот элемент и путь до него должны быть
     * выделены в обособленную цепочку
     * @name Controls/_display/Search#dedicatedItemProperty
     */
    protected _$dedicatedItemProperty: string;

    protected _$markBreadcrumbs: boolean;

    createBreadcrumbsItem(options: IBreadcrumbsItemOptions): BreadcrumbsItem {
        options.itemModule = 'Controls/display:BreadcrumbsItem';
        const item = this.createItem({
            ...options,
            markBreadcrumbs: this._$markBreadcrumbs,
        });
        return item as any as BreadcrumbsItem;
    }

    createRootSeparator(
        options: IRootSeparatorOptions<S>
    ): RootSeparatorItem<S> {
        const item = this.createItem({ ...options });
        return item as any as RootSeparatorItem<S>;
    }

    protected _createComposer(): itemsStrategy.Composer<S, T> {
        const composer = super._createComposer();
        composer.append(SearchStrategy, {
            display: this,
            dedicatedItemProperty: this._$dedicatedItemProperty,
            treeItemDecoratorModule: 'Controls/display:TreeItemDecorator',
        });
        composer.append(RootSeparatorStrategy, {
            display: this,
        });

        return composer;
    }
}

Object.assign(Search.prototype, {
    '[Controls/_display/Search]': true,
    _moduleName: 'Controls/display:Search',
    _$dedicatedItemProperty: undefined,
    _$markBreadcrumbs: false,
});
