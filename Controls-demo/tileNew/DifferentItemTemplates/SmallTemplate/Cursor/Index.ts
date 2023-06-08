import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/SmallTemplate/Cursor/Cursor';
import { Memory } from 'Types/source';

const data = [
    {
        key: 0,
        title: 'Курсор default',
        cursor: 'default',
    },
    {
        key: 1,
        title: 'Курсор pointer',
        cursor: 'pointer',
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
