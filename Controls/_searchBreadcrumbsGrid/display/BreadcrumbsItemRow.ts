/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import { object } from 'Types/util';
import { Model } from 'Types/entity';
import { TemplateFunction } from 'UI/Base';
import SearchGridDataRow from './SearchGridDataRow';
import { TreeChildren } from 'Controls/baseTree';
import SearchGridCollection from './SearchGridCollection';
import { GridDataRow, TColspanCallbackResult, IColumn } from 'Controls/grid';
import { IOptions as IBreadcrumbsItemCellOptions } from './BreadcrumbsItemCell';

export interface IOptions<T extends Model> {
    owner?: SearchGridCollection<T>;
    last: SearchGridDataRow<T>;
}

/**
 * Хлебная крошка
 * @class Controls/_searchBreadcrumbsGrid/BreadcrumbsItemRow
 * @extends Controls/_display/CollectionItem
 * @private
 */
export default class BreadcrumbsItemRow<
    T extends Model = Model
> extends GridDataRow<T> {
    readonly EditableItem: boolean = false;
    readonly Fadable: boolean = false;
    get Markable(): boolean {
        return this._$markBreadcrumbs;
    }

    protected _$owner: SearchGridCollection<T>;

    /**
     * Последний элемент хлебной крошки
     */
    protected _$last: SearchGridDataRow<T>;

    protected _$cellTemplate: TemplateFunction;

    protected _$colspanBreadcrumbs: boolean;

    protected _$breadCrumbsMode: 'row' | 'cell';

    protected _$parent: SearchGridDataRow<T>;

    protected _$isReadonly: boolean;

    protected _$containerWidth: number;

    protected _$markBreadcrumbs: boolean;

    readonly listInstanceName: string = 'controls-SearchBreadcrumbsGrid';

    readonly listElementName: string = 'row';

    protected get _first(): SearchGridDataRow<T> {
        const root = this._$owner ? this._$owner.getRoot() : {};
        let current = this._$last;

        while (current) {
            const parent = current.getParent();
            if (
                !parent ||
                parent === root ||
                parent['[Controls/treeGrid:TreeGridGroupDataRow]']
            ) {
                break;
            }
            current = parent;
        }

        return current;
    }

    get key(): unknown {
        // В качестве идентификатора отдаем ключ последней записи крошки
        return this._$last.getContents().getKey();
    }

    // region Public methods

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

    setContents(): void {
        throw new ReferenceError('BreadcrumbsItem contents is read only.');
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

    /**
     * Returns branch level in tree
     */
    getLevel(): number {
        const first = this._first;
        return first ? first.getLevel() : 0;
    }

    getLast(): SearchGridDataRow<T> {
        return this._$last;
    }

    getParent(): SearchGridDataRow<T> {
        return this._$parent;
    }

    getChildren(withFilter: boolean = true): TreeChildren<T> {
        return this._$owner.getChildren(this, withFilter);
    }

    hasChildren(): boolean {
        return this.getLast().hasChildren();
    }

    isRoot(): boolean {
        return false;
    }

    isGroupNode(): boolean {
        return false;
    }

    getTemplate(): TemplateFunction | string {
        // В старой поисковой модели в menu хлебные крошки отрисовывают с помощью itemTemplate,
        // у себя мы рисуем хлебные крошки с помощью searchBreadCrumbsItemTemplate
        if (this._$owner['[Controls/_display/Search]']) {
            return super.getTemplate.apply(this, arguments);
        } else {
            return this.getDefaultTemplate();
        }
    }

    getCellTemplate(): TemplateFunction | string {
        return this._$cellTemplate;
    }

    getBreadcrumbsItemTemplate(): TemplateFunction | string {
        return 'Controls/breadcrumbs:ItemTemplate';
    }

    setColspanBreadcrumbs(colspanBreadcrumbs: boolean): void {
        if (this._$colspanBreadcrumbs !== colspanBreadcrumbs) {
            this._$colspanBreadcrumbs = colspanBreadcrumbs;
            this._reinitializeColumns();
        }
    }

    setBreadCrumbsMode(breadCrumbsMode: 'row' | 'cell'): void {
        if (this._$breadCrumbsMode === breadCrumbsMode) {
            return;
        }

        this._$breadCrumbsMode = breadCrumbsMode;
        this._reinitializeColumns();
    }

    isReadonly(): boolean {
        return this._$isReadonly;
    }

    protected _getColspan(
        column: IColumn,
        columnIndex: number
    ): TColspanCallbackResult {
        return this._$colspanBreadcrumbs ? 'end' : 1;
    }

    protected _getMultiSelectAccessibility(): boolean | null {
        const value = object.getPropertyValue<boolean | null>(
            this.getLast().getContents(),
            this._$multiSelectAccessibilityProperty
        );
        return value === undefined ? true : value;
    }

    // endregion

    protected _getColumnFactoryParams(
        column: IColumn,
        columnIndex: number
    ): Partial<IBreadcrumbsItemCellOptions<T>> {
        return {
            ...super._getColumnFactoryParams(column, columnIndex),
            breadCrumbsMode: this._$breadCrumbsMode,
        };
    }
}

Object.assign(BreadcrumbsItemRow.prototype, {
    '[Controls/_searchBreadcrumbsGrid/BreadcrumbsItemRow]': true,
    '[Controls/_baseTree/BreadcrumbsItem]': true,
    _moduleName: 'Controls/searchBreadcrumbsGrid:BreadcrumbsItemRow',
    _instancePrefix: 'search-breadcrumbs-grid-row-',
    _cellModule: 'Controls/searchBreadcrumbsGrid:BreadcrumbsItemCell',
    _$cellTemplate:
        'Controls/searchBreadcrumbsGrid:SearchBreadcrumbsItemTemplate',
    _$last: null,
    _$parent: null,
    _$colspanBreadcrumbs: true,
    _$displayExpanderPadding: false,
    _$breadCrumbsMode: 'row',
    _$isReadonly: false,
    _$containerWidth: null,
    _$markBreadcrumbs: null,
});
