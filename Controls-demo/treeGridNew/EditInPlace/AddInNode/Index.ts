import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/EditInPlace/AddInNode/AddInNode';
import * as ColumnTemplate from 'wml!Controls-demo/treeGridNew/EditInPlace/AddInNode/ColumnTemplate';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { Model } from 'Types/entity';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Flat;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _columns: IColumn[] = Flat.getColumns();
    private _markedKey: number;
    private _showAddButton: boolean = false;
    private _fakeKey: number = 101010;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            EditInPlaceAddInNode: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                },
            },
        };
    }

    protected _beforeMount(): void {
        this._columns.forEach((c) => {
            c.template = ColumnTemplate;
        });
    }

    protected _beginAdd(): void {
        this._children.tree.beginAdd({
            item: new Model({
                keyProperty: 'key',
                rawData: {
                    id: this._fakeKey++,
                    title: '',
                    country: '',
                    rating: '',
                    parent: this._markedKey,
                    type: null,
                },
            }),
        });
    }

    protected _onMarkedKeyChanged(e: Event, key: number): void {
        this._showAddButton =
            this._children.tree.getItems().getRecordById(key).get('type') !== null;
    }
}
