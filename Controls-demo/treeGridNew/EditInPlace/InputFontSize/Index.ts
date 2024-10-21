import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/EditInPlace/InputFontSize/InputFontSize';
import { HierarchicalMemory } from 'Types/source';
import * as TitleCellTemplate from 'wml!Controls-demo/treeGridNew/EditInPlace/InputFontSize/ColumnTemplate/Title';
import * as CountryCellTemplate from 'wml!Controls-demo/treeGridNew/EditInPlace/InputFontSize/ColumnTemplate/Country';
import { IColumn } from 'Controls/grid';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Flat;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _columns: IColumn[] = Flat.getColumns();

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            EditInPlaceInputFontSize: {
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

    protected _beforeMount(): void {
        this._columns[0].template = TitleCellTemplate;
        // eslint-disable-next-line
        this._columns[2].template = CountryCellTemplate;
    }
}
