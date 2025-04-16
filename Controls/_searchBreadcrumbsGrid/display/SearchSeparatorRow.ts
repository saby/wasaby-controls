/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { Model } from 'Types/entity';
import {
    GridRow,
    TColspanCallbackResult,
    IColumn,
    TColumns,
    IInitializeColumnsOptions,
    IItemTemplateParams,
    IGridRowOptions,
} from 'Controls/grid';
import SearchGridCollection from './SearchGridCollection';
import { IOptions } from 'Controls/_gridDisplay/Row';
import { TOffsetSize } from 'Controls/_interface/IOffset';

export interface ISearchSeparatorRowOptions<T extends Model = Model> extends IGridRowOptions<T> {
    task88221034408419: boolean;
}

export default class SearchSeparatorRow<T extends Model = Model> extends GridRow<string> {
    readonly EditableItem: boolean = false;

    get Markable(): boolean {
        return false;
    }

    readonly Fadable: boolean = false;

    protected _$owner: SearchGridCollection;

    protected _$task88221034408419: boolean;

    readonly listInstanceName: string = 'controls-SearchBreadcrumbsGrid';

    readonly listElementName: string = 'row';

    // Согласно стандарту разделитель не имеет заливки при ховере.
    protected _$hoverBackgroundStyle = 'transparent';

    getContents(): string {
        return 'search-separator';
    }

    constructor(options: ISearchSeparatorRowOptions<T>) {
        super(options);
        this._$task88221034408419 = options.task88221034408419;
    }

    protected _updateRowProps(): void {
        // Запрашиваем настройки для row,
        // чтобы иметь возможность повлиять на отображение аналогично хлебным крошкам
        this._rowProps =
            typeof this._$getRowProps === 'function'
                ? this._$getRowProps(
                      new Model({
                          keyProperty: this.getKeyProperty(),
                          rawData: {
                              [this.getKeyProperty()]: this.getContents(),
                          },
                      })
                  )
                : null;
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

    isSticked(): boolean {
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

    protected _getColspan(column: IColumn, columnIndex: number): TColspanCallbackResult {
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
