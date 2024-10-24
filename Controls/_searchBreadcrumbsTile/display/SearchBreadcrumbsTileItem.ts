/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
 */
import { Model } from 'Types/entity';
import { TemplateFunction } from 'UI/Base';
import { TreeTileCollectionItem } from 'Controls/treeTile';

export class SearchBreadcrumbsTileItem<T extends Model = Model> extends TreeTileCollectionItem<T> {
    /**
     * Последний элемент хлебной крошки
     */
    protected _$last: TreeTileCollectionItem<T>;

    protected _$parent: TreeTileCollectionItem<T>;

    protected _$isReadonly: boolean;

    protected _$containerWidth: number;

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

    setContainerWidth(containerWidth: number): boolean {
        const isUpdated = this._$containerWidth !== containerWidth;
        if (isUpdated) {
            this._$containerWidth = containerWidth;
            this._nextVersion();
            return true;
        }
        return false;
    }

    getContainerWidth(): number {
        return this._$containerWidth;
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
    _$containerWidth: null,
});
