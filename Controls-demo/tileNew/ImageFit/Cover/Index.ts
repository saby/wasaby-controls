import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/tileNew/ImageFit/Cover/Cover';
import { items } from 'Controls-demo/tileNew/ImageFit/resources/DataCatalog';
import { Model } from 'Types/entity';
import { HierarchicalMemory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return items;
}

export default class extends Control {
    protected _template: TemplateFunction = Template;

    protected _imageUrlResolver(
        width: number,
        height: number,
        url: string = '',
        item: Model
    ): string {
        return item.get('imageFit');
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData1: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'id',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    nodeProperty: 'parent@',
                },
            },
        };
    }
}
