import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IData } from 'Controls-demo/tileNew/DataHelpers/DataCatalog';
import Images from 'Controls-demo/tileNew/DataHelpers/Images';

import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/ImageGradient/ImageGradient';

const data: IData[] = [
    {
        key: 0,
        title: 'С градиентом',
        image: Images.CAR,
        imageEffect: 'gradient',
    },
    {
        key: 1,
        title: 'Без градиента',
        image: Images.CAR,
        imageEffect: 'none',
    },
];

/**
 * https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/tile/item/rich/#gradient
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
