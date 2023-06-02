import { Control, TemplateFunction } from 'UI/Base';
import { Memory, CrudEntityKey } from 'Types/source';
import { SyntheticEvent } from 'Vdom/Vdom';
import { query } from 'Application/Env';

import * as Template from 'wml!Controls-demo/list_new/Marker/OnBeforeMarkedKeyChanged/OnBeforeMarkedKeyChanged';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _timeout: number;

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: [
                {
                    key: 1,
                    title: 'Асинхронная обработка перед установкой маркера',
                },
                {
                    key: 2,
                    title: 'Асинхронная обработка перед установкой маркера',
                },
                {
                    key: 3,
                    title: 'Асинхронная обработка перед установкой маркера',
                },
            ],
        });
        this._timeout = query.get.timeout ? query.get.timeout : '1000';
    }

    _onBeforeMarkedKeyChanged(
        event: SyntheticEvent,
        key: CrudEntityKey
    ): CrudEntityKey | Promise<CrudEntityKey> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(key);
            }, this._timeout);
        });
    }
}
