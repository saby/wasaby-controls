import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';

import * as Template from 'wml!Controls-demo/list_new/Decorators/Decorators';

const data = [
    {
        key: 1,
        fontColorStyle: 'list',
        value: 12659333,
    },
    {
        key: 2,
        fontColorStyle: 'group',
        value: 12659333,
    },
    {
        key: 3,
        fontColorStyle: 'results',
        value: 12659333,
    },
];

/**
 * Демка для статьи https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/decorator/
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

    static _styles: string[] = ['DemoStand/Controls-demo'];
}
