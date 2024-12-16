import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IData } from 'Controls-demo/tileNew/DataHelpers/DataCatalog';
import Images from 'Controls-demo/tileNew/DataHelpers/Images';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/ImageSize/ImageSize';

function getData(): IData[] {
    return [
        {
            key: 0,
            title: 'Размер s',
            image: Images.LION,
            imageSize: 's',
        },
        {
            key: 1,
            title: 'Размер m',
            image: Images.LION,
            imageSize: 'm',
        },
    ];
}

/**
 * https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/tile/item/rich/#size
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
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
    }
}
