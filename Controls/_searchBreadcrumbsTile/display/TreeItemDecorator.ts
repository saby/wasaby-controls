/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import { Model } from 'Types/entity';
import { TreeTileCollectionItem } from 'Controls/treeTile';

export interface IOptions<T extends Model> {
    source: TreeTileCollectionItem<T>;
    parent?: TreeTileCollectionItem<T>;
    multiSelectVisibility: string;
    multiSelectAccessibilityProperty: string;
}

export class TreeItemDecorator<
    T extends Model
> extends TreeTileCollectionItem<T> {
    protected _$source: TreeTileCollectionItem<T>;

    constructor(options?: IOptions<T>) {
        super({
            contents: options?.source?.contents,
            multiSelectVisibility: options?.multiSelectVisibility,
            multiSelectAccessibilityProperty:
                options?.multiSelectAccessibilityProperty,
        });
        this._$source = options?.source;
        this._$parent = options?.parent;

        // Декоратор нужен, чтобы задать правильный parent для item-a, при этом не испортив оригинальный item
        // Прокидываем все методы из оригинального item-a в decorator, за исключением методов, связанных с parent
        const notRewriteProperties = ['getLevel', 'getParent'];
        for (const property in this._$source) {
            if (
                typeof this._$source[property] === 'function' &&
                !notRewriteProperties.includes(property)
            ) {
                this[property] = this._$source[property].bind(this._$source);
            }
        }
    }
}

Object.assign(TreeItemDecorator.prototype, {
    '[Controls/_searchBreadcrumbsTile/TreeItemDecorator]': true,
    '[Controls/_baseTree/TreeItemDecorator]': true,
    _moduleName: 'Controls/searchBreadcrumbsTile:TreeItemDecorator',
    _$source: undefined,
});
