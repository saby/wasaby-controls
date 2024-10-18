import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory } from 'Types/source';

import Images from 'Controls-demo/tileNew/DataHelpers/Images';
import { IData } from 'Controls-demo/tileNew/DataHelpers/DataCatalog';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/PreviewTemplate/BottomRightTemplate/BottomRightTemplate';

function getData(): IData[] {
    return [
        {
            key: 0,
            parent: null,
            type: null,
            title: 'Машина',
            image: Images.CAR,
            counter: 100,
        },
        {
            key: 1,
            parent: null,
            type: null,
            title: 'Лев с короной',
            image: Images.LION,
            counter: 350,
        },
    ];
}

/**
 * https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/tile/item/preview/#right
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                },
            },
        };
    }
}
