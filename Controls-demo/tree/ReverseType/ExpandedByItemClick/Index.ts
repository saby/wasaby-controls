import { Control, TemplateFunction } from 'UI/Base';
import { data } from 'Controls-demo/tree/data/Devices';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import ExpandedSource from 'Controls-demo/tree/data/ExpandedSource';
import * as Template from 'wml!Controls-demo/tree/ReverseType/ExpandedByItemClick/ExpandedByItemClick';

function getData() {
    return data;
}

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static _styles: string[] = ['DemoStand/Controls-demo'];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData0: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new ExpandedSource({
                        keyProperty: 'key',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                },
            },
        };
    }
}
