import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { Memory } from 'Types/source';
import { getGroupedCatalogWithHiddenGroup as getData } from '../../DemoHelpers/Data/HiddenGroup';
import * as Template from 'wml!Controls-demo/list_new/Grouped/HiddenGroup/HiddenGroup';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;

    protected _beforeMount(
        options?: IControlOptions,
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: getData(),
        });
    }
}
