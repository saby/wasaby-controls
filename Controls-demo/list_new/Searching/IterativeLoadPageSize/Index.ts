import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/Searching/IterativeLoadPageSize/IterativeLoadPageSize';
import PortionedSearchMemory from 'Controls-demo/list_new/Searching/DataHelpers/PortionedSearchMemory';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: PortionedSearchMemory = null;

    protected _beforeMount(): void {
        this._viewSource = new PortionedSearchMemory({
            direction: 'down',
            keyProperty: 'key',
        });
        this._viewSource.setFastLoad(true);
    }
}
