import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/EditInPlace/EditingCell/EditingCell';
import { Memory } from 'Types/source';
import { showType } from 'Controls/toolbars';
import 'wml!Controls-demo/gridNew/EditInPlace/EditingCell/_cellEditor';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { IItemAction } from 'Controls/itemActions';
import { Editing } from 'Controls-demo/gridNew/DemoHelpers/Data/Editing';
import { IColumnRes } from 'Controls-demo/gridNew/DemoHelpers/DataCatalog';
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
    protected _columns: IColumnRes[] = Editing.getEditingColumns();
    protected _items: RecordSet;
    protected _lastId: number;
    protected _viewModel: unknown;

    protected _itemActions: IItemAction = [
        {
            id: 1,
            icon: 'icon-Erase icon-error',
            title: 'delete',
            style: 'bordered',
            showType: showType.TOOLBAR,
            handler: function (item: Model): void {
                this._children.list
                    .removeItems({
                        selected: [item.get('key')],
                        excluded: [],
                    })
                    .then(() => {
                        this._updateResults();
                    });
            }.bind(this),
        },
    ];

    protected _beforeMount(props: IProps): void {
        this._lastId = getData().length + 1;
        this._items = props._dataOptionsValue.EditInPlaceEditingCell.items;
    }

    protected _afterMount(): void {
        this._viewModel = this._children.list._children.listControl.getViewModel();
    }

    protected _beginAdd(): void {
        this._children.list.beginAdd({
            item: new Model({
                keyProperty: 'key',
                rawData: {
                    key: this._lastId++,
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

    private _updateResults(): void {
        // eslint-disable-next-line
        const self = this;
        const source = this._options._dataOptionsValue.EditInPlaceEditingCell.source;
        source.query().addCallback((items) => {
            const rawData = items.getRawData();
            const getSumm = (title) => {
                return rawData.items.reduce((acc: number, cur: unknown) => {
                    // eslint-disable-next-line
                    acc += parseInt(cur[title], 10) || 0;
                    return acc;
                }, 0);
            };
            const newColumns = self._columns.map((cur) => {
                if (cur.results || cur.results === 0) {
                    return {
                        ...cur,
                        results: getSumm(cur.displayProperty),
                    };
                }
                return cur;
            });
            self._columns = newColumns;
            return items;
        });
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            EditInPlaceEditingCell: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    multiSelectVisibility: 'visible',
                    selectedKeys: [],
                },
            },
        };
    },
});
