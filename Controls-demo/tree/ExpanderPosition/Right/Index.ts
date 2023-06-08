import { Control, TemplateFunction } from 'UI/Base';
import { CrudEntityKey, Memory } from 'Types/source';

import * as Template from 'wml!Controls-demo/tree/ExpanderPosition/Right/Right';

import { data } from 'Controls-demo/tree/data/Devices';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _expandedItems: CrudEntityKey[] = [null];
    protected _collapsedItems: CrudEntityKey[] = [12];

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data,
            filter: (): boolean => {
                return true;
            },
        });
    }
}
