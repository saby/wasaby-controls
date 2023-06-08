/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import { Model } from 'Types/entity';
import { TemplateFunction } from 'UI/Base';
import { TreeTileCollectionItem } from 'Controls/treeTile';

export class SearchBreadcrumbsTileItem<
    T extends Model = Model
> extends TreeTileCollectionItem<T> {
    /**
     * Последний элемент хлебной крошки
     */
    protected _$last: TreeTileCollectionItem<T>;

    protected _$parent: TreeTileCollectionItem<T>;

    protected _$isReadonly: boolean;

    get key(): unknown {
        const contents = this.getContents();
        return contents[contents.length - 1].getKey();
    }

    getTemplate(
        itemTemplateProperty: string,
        userTemplate: TemplateFunction | string
    ): TemplateFunction | string {
        return 'Controls/searchBreadcrumbsTile:BreadcrumbsTileItemTemplate';
    }

    getContents(): T[] {
        const root = this._$owner ? this._$owner.getRoot() : {};
        let current = this._$last;
        const contents = [];

        // Go up from last item until end
        while (current) {
            contents.unshift(current.getContents());
            current = current.getParent();

            // current может не быть если запись переместили в папку, которой нет в коллекции
            if (
                !current ||
                current === root ||
                current['[Controls/treeGrid:TreeGridGroupDataRow]']
            ) {
                break;
            }
        }

        return contents as any;
    }

    isReadonly(): boolean {
        return this._$isReadonly;
    }
}

Object.assign(SearchBreadcrumbsTileItem.prototype, {
    '[Controls/_baseTree/BreadcrumbsItem]': true,
    '[Controls/_searchBreadcrumbsTile/BreadcrumbsItemRow]': true,
    _moduleName: 'Controls/searchBreadcrumbsTile:SearchBreadcrumbsTileItem',
    _instancePrefix: 'search-breadcrumbs-tile-item-',
    _$last: null,
    _$parent: null,
    _$isReadonly: false,
});
