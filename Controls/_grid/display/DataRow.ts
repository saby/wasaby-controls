/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
import { TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';

import { IMarkable, ISelectableItem, groupConstants } from 'Controls/display';

import Row, { IOptions as IRowOptions } from './Row';
import DataCell, { IOptions as IGridDataCellOptions } from './DataCell';
import ILadderSupport from './interface/ILadderSupport';
import {
    IDisplaySearchValue,
    IDisplaySearchValueOptions,
} from './interface/IDisplaySearchValue';
import { IColumn, TColumns } from './interface/IColumn';
import { Model } from 'Types/entity';
import { IItemTemplateParams } from 'Controls/_grid/display/mixins/Row';

export interface IOptions<T extends Model = Model>
    extends IRowOptions<T>,
        IDisplaySearchValueOptions {}

/**
 * Строка таблицы, которая отображает данные из RecordSet-а
 * @private
 */
export default class DataRow<T extends Model = Model>
    extends Row<T>
    implements IMarkable, ILadderSupport, ISelectableItem, IDisplaySearchValue
{
    protected _$columnItems: DataCell[];
    protected _$searchValue: string;

    readonly EditableItem: boolean = true;
    readonly DisplayItemActions: boolean = true;
    readonly DisplaySearchValue: boolean = true;
    readonly LadderSupport: boolean = true;
    get Markable(): boolean {
        return true;
    }
    readonly VirtualEdgeItem: boolean = true;
    readonly Fadable: boolean = true;
    readonly SelectableItem: boolean = true;
    readonly EnumerableItem: boolean = true;
    readonly EdgeRowSeparatorItem: boolean = true;
    readonly DraggableItem: boolean = true;
    readonly SupportItemActions: boolean = true;
    private _$editingColumnIndex: number;
    protected _$hasStickyGroup: boolean;

    getTemplate(
        itemTemplateProperty: string,
        userTemplate: TemplateFunction | string
    ): TemplateFunction | string {
        const templateFromProperty = itemTemplateProperty
            ? this.getContents().get(itemTemplateProperty)
            : '';
        return (
            templateFromProperty || userTemplate || this.getDefaultTemplate()
        );
    }

    protected _getBaseItemClasses(params: IItemTemplateParams): string {
        return (
            super._getBaseItemClasses(params) + ' js-controls-Grid__data-row'
        );
    }

    setGridColumnsConfig(columns: TColumns): void {
        this.setColumnsConfig(columns);
    }

    protected _getColumnFactoryParams(
        column: IColumn,
        columnIndex: number
    ): Partial<IGridDataCellOptions<T>> {
        return {
            ...super._getColumnFactoryParams(column, columnIndex),
            searchValue: this._$searchValue,
        };
    }

    setSearchValue(searchValue: string): void {
        super.setSearchValue(searchValue);
        if (this._$columnItems) {
            this._$columnItems.forEach((cell, cellIndex) => {
                if (cell.DisplaySearchValue) {
                    cell.setSearchValue(searchValue);
                }
            });
        }
    }

    getSearchValue(): string {
        return this._$searchValue;
    }

    setEditing(
        editing: boolean,
        editingContents?: T,
        silent?: boolean,
        columnIndex?: number
    ): void {
        super.setEditing(editing, editingContents, silent, columnIndex);
        if (
            typeof columnIndex === 'number' &&
            this._$editingColumnIndex !== columnIndex
        ) {
            this._$editingColumnIndex = columnIndex;
        }

        // FIXME: Временное решение - аналог RowEditor из старых таблиц(редактирование во всю строку).
        //  Первая ячейка редактируемой строки растягивается, а ее шаблон заменяется на
        //  itemEditorTemplate (обычная колонка с прикладным контентом).
        //  Избавиться по https://online.sbis.ru/opendoc.html?guid=80420a0d-1f45-4acb-8feb-281bf1007821
        this.setRowTemplate(
            editing ? this._$owner.getItemEditorTemplate() : undefined
        );
        this.setRowTemplateOptions(
            editing ? this._$owner.getItemEditorTemplateOptions() : undefined
        );
        this._reinitializeColumns();
    }

    getEditingColumnIndex(): number {
        return this._$editingColumnIndex;
    }

    setHasStickyGroup(hasStickyGroup: boolean): void {
        if (this._$hasStickyGroup !== hasStickyGroup) {
            this._$hasStickyGroup = hasStickyGroup;
            this._nextVersion();
        }
    }

    _initializeColumns(): void {
        super._initializeColumns({
            colspanStrategy: 'skipColumns',
            prepareStickyLadderCellsStrategy: !this._$rowTemplate
                ? 'add'
                : 'colspan',
        });
    }

    hasStickyGroup(): boolean {
        return (
            this._$hasStickyGroup &&
            this._$contents.get(this._$owner.getGroupProperty()) !==
                groupConstants.hiddenGroup
        );
    }

    // TODO вроде _onPropertyChange этому замена
    updateContentsVersion(): void {
        this._nextVersion();
        this._redrawColumns('all');
    }

    protected _onPropertyChange(
        event: SyntheticEvent,
        changedProperties: Record<string, unknown>
    ): void {
        super._onPropertyChange(event, changedProperties);
        this._updateRowProps();

        // Колспан может зависеть от данных в рекорде
        const shouldRecountCells = !!this._$colspanCallback;
        if (shouldRecountCells) {
            this._reinitializeColumns();
        }

        if (!shouldRecountCells) {
            const cellsIterator = this.getCellsIterator();
            cellsIterator((cell) => {
                return cell.updateCellProps();
            });
        }
    }
}

Object.assign(DataRow.prototype, {
    '[Controls/_display/grid/DataRow]': true,
    _moduleName: 'Controls/grid:GridDataRow',
    _cellModule: 'Controls/grid:GridDataCell',
    _instancePrefix: 'grid-data-row-',
    _$editingColumnIndex: null,
    _$searchValue: '',
    _$hasStickyGroup: false,
});
