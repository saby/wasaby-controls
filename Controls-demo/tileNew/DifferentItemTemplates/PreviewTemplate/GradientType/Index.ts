import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory } from 'Types/source';

import Images from 'Controls-demo/tileNew/DataHelpers/Images';
import { IData } from 'Controls-demo/tileNew/DataHelpers/DataCatalog';

import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/PreviewTemplate/GradientType/GradientType';

const data: IData[] = [
    {
        key: 0,
        parent: null,
        type: null,
        gradientType: 'dark',
        titleStyle: 'light',
        title: 'Тёмный градиент заголовка',
        image: Images.CAR,
    },
    {
        key: 1,
        parent: null,
        type: null,
        gradientType: 'light',
        titleStyle: 'dark',
        title: 'Светлый градиент заголовка',
        image: Images.CAR,
    },
    {
        key: 2,
        parent: null,
        type: null,
        gradientType: 'custom',
        titleStyle: 'dark',
        gradientColor: '#E0E0E8',
        title: 'Пользовательский градиент заголовка',
        image: Images.CAR,
    },
];

/**
 * https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/tile/item/preview/#type
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory = null;

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'id',
            parentProperty: 'parent',
            data,
        });
    }
}
