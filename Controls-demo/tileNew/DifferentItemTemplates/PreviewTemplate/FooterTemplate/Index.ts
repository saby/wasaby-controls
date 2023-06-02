import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory } from 'Types/source';

import Images from 'Controls-demo/tileNew/DataHelpers/Images';
import { IData } from 'Controls-demo/tileNew/DataHelpers/DataCatalog';

import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/PreviewTemplate/FooterTemplate/BottomRightTemplate';

const data: IData[] = [
    {
        key: 0,
        parent: null,
        type: null,
        title: 'Машина',
        image: Images.CAR,
    },
    {
        key: 1,
        parent: null,
        type: null,
        title: 'Лев с короной',
        image: Images.LION,
    },
];

/**
 * https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/tile/item/preview/#footer
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory = null;

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'key',
            parentProperty: 'parent',
            data,
        });
    }
}
