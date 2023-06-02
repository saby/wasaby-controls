import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { Memory } from 'Types/source';

import * as Template from 'wml!Controls-demo/list_new/ColumnsView/Nested/Template';

const rootData = [
    {
        key: 1,
        title: 'Запись списка верхнего уровня. В шаблоне содержится вложенный многоколоночный список',
    },
];

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _rootSource: Memory;

    protected _beforeMount(
        options?: IControlOptions,
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._rootSource = new Memory({
            keyProperty: 'key',
            data: rootData,
        });
    }
}
