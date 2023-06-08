import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IData } from 'Controls-demo/tileNew/DataHelpers/DataCatalog';
import Images from 'Controls-demo/tileNew/DataHelpers/Images';

import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/imagePosition/imagePosition';

const data: IData[] = [
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

/**
 * https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/tile/item/rich/#position
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data,
        });
    }
}
