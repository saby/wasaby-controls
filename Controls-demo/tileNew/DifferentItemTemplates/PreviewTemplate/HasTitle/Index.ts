import { Control, TemplateFunction } from 'UI/Base';
import Images from 'Controls-demo/tileNew/DataHelpers/Images';
import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/PreviewTemplate/HasTitle/HasTitle';
import { Memory } from 'Types/source';

const data = [
    {
        key: 0,
        title: 'Плитка с заголовком',
        image: Images.CHEETAH,
        hasTitle: true,
    },
    {
        key: 1,
        title: 'Плитка без заголовка',
        image: Images.LION,
        hasTitle: false,
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
