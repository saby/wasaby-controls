import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IData } from 'Controls-demo/tileNew/DataHelpers/DataCatalog';
import Images from 'Controls-demo/tileNew/DataHelpers/Images';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/imagePosition/imagePosition';

function getData(): IData[] {
    return [
        {
            key: 0,
            title: 'Сверху',
            image: Images.MEDVED,
            imagePosition: 'top',
        },
        {
            key: 1,
            title: 'Внизу',
            image: Images.MEDVED,
            imagePosition: 'bottom',
        },
        {
            key: 2,
            title: 'Слева',
            image: Images.MEDVED,
            imagePosition: 'left',
        },
        {
            key: 3,
            title: 'Справа',
            image: Images.MEDVED,
            imagePosition: 'right',
        },
    ];
}

/**
 * https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/tile/item/rich/#position
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
