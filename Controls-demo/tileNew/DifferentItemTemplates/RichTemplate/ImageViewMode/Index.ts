import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IData } from 'Controls-demo/tileNew/DataHelpers/DataCatalog';
import Images from 'Controls-demo/tileNew/DataHelpers/Images';

import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/ImageViewMode/ImageViewMode';

const data: IData[] = [
    {
        key: 0,
        title: 'Прямоугольное изображение',
        image: Images.LION,
        imageViewMode: 'rectangle',
    },
    {
        key: 1,
        title: 'Изображение в круге',
        image: Images.MEDVED,
        imageViewMode: 'circle',
    },
    {
        key: 2,
        title: 'Изображение с суперэллипсом',
        image: Images.CAR,
        imageViewMode: 'ellipse',
    },
    {
        key: 3,
        title: 'Изображение скрыто',
        image: Images.RIVER,
        imageViewMode: 'none',
    },
];

/**
 * https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/tile/item/rich/#view
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
