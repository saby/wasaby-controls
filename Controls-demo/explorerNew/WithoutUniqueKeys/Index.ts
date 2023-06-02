import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/explorerNew/WithoutUniqueKeys/WithoutUniqueKeys';
import {
    data,
    columns,
    DemoUniqueMemory,
} from 'Controls-demo/explorerNew/WithoutUniqueKeys/data';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: DemoUniqueMemory;
    protected _columns: [] = columns as [];
    protected _root: string = 'root';

    protected _beforeMount(): void {
        this._viewSource = new DemoUniqueMemory({
            keyProperty: 'keyUnique',
            parentProperty: 'parentUnique',
            data,
            model: 'My/application/models/UserUniqueModel',
        });
    }
}
