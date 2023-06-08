import { Control, TemplateFunction } from 'UI/Base';
import Images from 'Controls-demo/tileNew/DataHelpers/Images';
import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/PreviewTemplate/TitleLines/TitleLines';
import { Memory } from 'Types/source';

const data = [
    {
        key: 0,
        title: 'Плитка c длинным заголовком, который отображается в две строки',
        image: Images.CHEETAH,
        hasTitle: true,
        titleLines: 2,
    },
    {
        key: 1,
        title: 'Плитка c длинным заголовком, который отображается в одну строку и должен быть отрезан по многоточию',
        image: Images.LION,
        hasTitle: true,
        titleLines: 1,
    },
];

/**
 * Демка используется для статьи https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/tile/item/config/
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory = null;
    protected _selectedKeys: string[] = [];
    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data,
        });
    }

    static _styles: string[] = ['DemoStand/Controls-demo'];
}
