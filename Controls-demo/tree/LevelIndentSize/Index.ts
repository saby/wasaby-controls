import { Control, TemplateFunction } from 'UI/Base';
import { Memory, CrudEntityKey } from 'Types/source';
import { data } from 'Controls-demo/tree/data/Devices';
import * as Template from 'wml!Controls-demo/tree/LevelIndentSize/LevelIndentSize';

/**
 * Демка для статьи https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/tree/paddings/
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _expandedItems: CrudEntityKey[] = [1];

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data,
            filter: (): boolean => {
                return true;
            },
        });
    }

    static _styles: string[] = ['DemoStand/Controls-demo'];
}
