/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import { CollectionItem, ICollectionItemOptions, IGroupNode } from 'Controls/display';
import TreeItem from './TreeItem';
import Tree from './Tree';
import { register } from 'Types/di';
import TreeChildren from './TreeChildren';
import { object } from 'Types/util';
import { Model } from 'Types/entity';

export interface IOptions<T extends Model = Model> extends ICollectionItemOptions<T> {
    owner?: Tree<T>;
    last: TreeItem<T>;
    parent: TreeItem<T>;
    markBreadcrumbs?: boolean;
}

/**
 * Хлебная крошка
 * @class Controls/_baseTree/BreadcrumbsItem
 * @extends Controls/_display/CollectionItem
 * @private
 */
export default class BreadcrumbsItem<T extends Model = Model>
    extends CollectionItem<T>
    implements IGroupNode
{
    readonly EditableItem: boolean = false;
    readonly Fadable: boolean = false;
    readonly StickableItem: boolean = false;
    get Markable(): boolean {
        return this._$markBreadcrumbs;
    }

    protected _instancePrefix: 'breadcrumbs-item-';
    protected _$owner: Tree<T>;

    /**
     * Последний элемент хлебной крошки
     */
    protected _$last: TreeItem<T>;

    protected _$markBreadcrumbs: boolean;

    protected get _first(): TreeItem<T> {
        const root = this._$owner ? this._$owner.getRoot() : {};
        let current = this._$last;

        while (current) {
            const parent = current.getParent();
            if (!parent || parent === root) {
                break;
            }
            current = parent;
        }

        return current;
    }

    // region Public methods

    getContents(): T {
        const root = this._$owner ? this._$owner.getRoot() : {};
        let current = this._$last;
        const contents = [];

        // Go up from last item until end
        while (current) {
            contents.unshift(current.getContents());
            current = current.getParent();
            if (current === root) {
                break;
            }
        }

        return contents as any;
    }

    setContents(): void {
        throw new ReferenceError('BreadcrumbsItem contents is read only.');
    }

    isNode(): boolean {
        return true;
    }

    /**
     * Returns branch level in tree
     */
    getLevel(): number {
        const first = this._first;
        return first ? first.getLevel() : 0;
    }

    getLast(): TreeItem<T> {
        return this._$last;
    }

    getParent(): TreeItem<T> {
        // Родителем хлебной крошки всегда является корневой узел, т.к. хлебная крошка это путь до корневого узла
        return this._$owner.getRoot();
    }

    getChildren(withFilter: boolean = true): TreeChildren<T> {
        return this._$owner.getChildren(this, withFilter);
    }

    hasChildren(): boolean {
        return this.getLast().hasChildren();
    }

    isRoot(): boolean {
        // Хлебная крошка не может быть корнем
        return false;
    }

    isGroupNode(): boolean {
        return false;
    }

    protected _getMultiSelectAccessibility(): boolean | null {
        const value = object.getPropertyValue<boolean | null>(
            this.getLast().getContents(),
            this._$multiSelectAccessibilityProperty
        );
        return value === undefined ? true : value;
    }

    // endregion
}

Object.assign(BreadcrumbsItem.prototype, {
    '[Controls/_baseTree/BreadcrumbsItem]': true,
    _moduleName: 'Controls/display:BreadcrumbsItem',
    _$last: null,
    _$markBreadcrumbs: false,
});

register('Controls/display:BreadcrumbsItem', BreadcrumbsItem, {
    instantiate: false,
});
