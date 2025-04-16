import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/EditInPlace/RowEditor/RowEditor';
import * as ColumnTemplate from 'wml!Controls-demo/treeGridNew/EditInPlace/RowEditor/ColumnTemplate';
import { HierarchicalMemory } from 'Types/source';
import { IColumn, TColspanCallbackResult } from 'Controls/grid';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { Model } from 'Types/entity';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Flat;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    protected _columns: IColumn[] = Flat.getColumns();

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            EditInPlaceRowEditor: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        data: getData(),
                        parentProperty: 'parent',
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                },
            },
        };
    }

    protected _colspanCallback(
        item: Model,
        column: IColumn,
        columnIndex: number,
        isEditing: boolean
    ): TColspanCallbackResult {
        return isEditing ? 'end' : undefined;
    }

    protected _beforeMount(): void {
        this._columns[0].template = ColumnTemplate;
    }
}
