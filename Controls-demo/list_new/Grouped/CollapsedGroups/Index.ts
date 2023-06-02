import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { Memory } from 'Types/source';
import { getGroupedCatalog as getData } from '../../DemoHelpers/Data/Groups';
import * as Template from 'wml!Controls-demo/list_new/Grouped/CollapsedGroups/CollapsedGroups';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _collapsedGroups: string[];

    protected _beforeMount(
        options?: IControlOptions,
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: getData(),
        });
        setTimeout(() => {
            this._collapsedGroups = ['apple', 'aser'];
        }, 20);
    }
}
