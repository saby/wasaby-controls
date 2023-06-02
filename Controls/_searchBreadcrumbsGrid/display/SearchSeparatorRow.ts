/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import {
    GridRow,
    TColspanCallbackResult,
    IColumn,
    TColumns,
    IInitializeColumnsOptions,
} from 'Controls/grid';
import SearchGridCollection from './SearchGridCollection';

export default class SearchSeparatorRow extends GridRow<string> {
    readonly EditableItem: boolean = false;
    readonly '[Controls/_itemActions/interface/IItemActionsItem]': boolean =
        false;

    get Markable(): boolean {
        return false;
    }
    readonly Fadable: boolean = false;

    protected _$owner: SearchGridCollection;

    readonly listInstanceName: string = 'controls-SearchBreadcrumbsGrid';

    readonly listElementName: string = 'row';

    getContents(): string {
        return 'search-separator';
    }

    getUid(): string {
        return 'search-separator';
    }

    isEditing(): boolean {
        return false;
    }

    isActive(): boolean {
        return false;
    }

    isMarked(): boolean {
        return false;
    }

    isSelected(): boolean {
        return false;
    }

    isSwiped(): boolean {
        return false;
    }

    getLevel(): number {
        return 0;
    }

    isVisibleCheckbox(): boolean {
        return false;
    }

    isLastItem(): boolean {
        return false;
    }

    setGridColumnsConfig(columns: TColumns): void {
        this.setColumnsConfig(columns);
    }

    protected _initializeColumns(options?: IInitializeColumnsOptions): void {
        super._initializeColumns({
            colspanStrategy: 'skipColumns',
            ...options,
        });
    }

    protected _getColspan(
        column: IColumn,
        columnIndex: number
    ): TColspanCallbackResult {
        return undefined;
    }
}

Object.assign(SearchSeparatorRow.prototype, {
    '[Controls/_searchBreadcrumbsGrid/SearchSeparatorRow]': true,
    '[Controls/_display/SearchSeparator]': true,
    _moduleName: 'Controls/searchBreadcrumbsGrid:SearchSeparatorRow',
    _instancePrefix: 'search-separator-row-',
    _cellModule: 'Controls/searchBreadcrumbsGrid:SearchSeparatorCell',
});
