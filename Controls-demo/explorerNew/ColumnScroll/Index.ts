import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/explorerNew/ColumnScroll/ColumnScroll';
import { Gadgets } from '../DataHelpers/DataCatalog';
import { IHeaderCell } from 'Controls/grid';
import { HierarchicalMemory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Gadgets;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: unknown = Gadgets.getGridColumnsForScroll();
    protected _header: IHeaderCell[] = [...Gadgets.getHeader(), { title: 'Подрядчик' }];
    protected _hasMultiSelect: boolean = false;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ColumnScroll: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'id',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    root: null,
                    viewMode: 'table',
                    keyProperty: 'id',
                    nodeProperty: 'parent@',
                    parentProperty: 'parent',
                    multiSelectVisibility: 'hidden',
                },
            },
        };
    }
}
