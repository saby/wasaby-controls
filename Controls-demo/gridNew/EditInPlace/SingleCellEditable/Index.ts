import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import * as Template from 'wml!Controls-demo/gridNew/EditInPlace/SingleCellEditable/SingleCellEditable';
import * as cellTemplate from 'wml!Controls-demo/gridNew/EditInPlace/SingleCellEditable/cellTemplate';
import * as firstCellTemplate from 'wml!Controls-demo/gridNew/EditInPlace/SingleCellEditable/firstCellTemplate';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';
import { IColumnRes } from 'Controls-demo/gridNew/DemoHelpers/DataCatalog';
import { Editing } from 'Controls-demo/gridNew/DemoHelpers/Data/Editing';
import { Record as entityRecord } from 'Types/entity';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

function getData() {
    return Editing.getEditingData();
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;
    private _itemActions: IItemAction[];
    private _columns: IColumnRes[];
    private _fakeId: number = 0;
    private _selectedKeys: number[] = [];
    private _isEmptySource: boolean = false;
    private _highlightOnHover: undefined | boolean;

    protected _beforeMount(): void {
        this._setColumns();
        this._setItemActions();
    }

    private _setViewSource(isEmpty: boolean): void {
        this._options._dataOptionsValue.EditInPlaceSingleCellEditable.setState({
            source: new Memory({
                keyProperty: 'key',
                data: isEmpty ? [] : Editing.getEditingData(),
            }),
        });
    }

    protected _beginAdd(): void {
        this._children.grid.beginAdd({
            columnIndex: 1,
            item: new entityRecord({
                rawData: {
                    key: ++this._fakeId,
                    title: '',
                    description: '',
                    price: '',
                    balance: '',
                    balanceCostSumm: '',
                    reserve: '',
                    costPrice: '',
                },
            }),
        });
    }

    private _setColumns(): void {
        this._columns = Editing.getEditingColumns().map((column, index) => {
            return {
                ...column,
                editable: index === 3 ? false : undefined,
                template: !(index === 0 || index === 3) ? cellTemplate : undefined,
            };
        });
        this._columns[0].template = firstCellTemplate;
    }

    private _setItemActions(): void {
        this._itemActions = [
            {
                id: 1,
                icon: 'icon-Erase icon-error',
                title: 'delete',
                showType: TItemActionShowType.TOOLBAR,
            },
        ];
    }

    _onBeforeBeginEdit(
        options: object,
        item: entityRecord,
        isAdd: boolean,
        columnIndex: number
    ): string {
        if (columnIndex === 0 || columnIndex === 3) {
            return 'Cancel';
        }
    }

    _toggleMultiSelectVisibility(e: Event, visibility: string): void {
        this._options._dataOptionsValue.EditInPlaceSingleCellEditable.setState({
            multiSelectVisibility: visibility,
        });
    }

    _toggleSource(e: Event, isEmptySource: Memory): void {
        if (this._isEmptySource !== isEmptySource) {
            this._isEmptySource = isEmptySource;
            this._setViewSource(isEmptySource);
        }
    }

    _toggleHighlightOnHover(e: Event, value: boolean): void {
        if (this._highlightOnHover !== value) {
            this._highlightOnHover = value;
        }
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            EditInPlaceSingleCellEditable: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                },
            },
        };
    },
});
