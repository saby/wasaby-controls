import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/tileNew/CustomMarker/CustomMarker';
import { Gadgets } from '../DataHelpers/DataCatalog';
import { HierarchicalMemory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import 'css!Controls-demo/tileNew/CustomMarker/CustomMarker';

const { getData } = Gadgets;

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            Marker: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'id',
                        data: getData(),
                    }),
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                },
            },
        };
    }
}
