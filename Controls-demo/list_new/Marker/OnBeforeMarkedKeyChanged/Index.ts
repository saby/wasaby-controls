import { Control, TemplateFunction } from 'UI/Base';
import { CrudEntityKey, Memory } from 'Types/source';
import { SyntheticEvent } from 'Vdom/Vdom';
import { query } from 'Application/Env';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import * as Template from 'wml!Controls-demo/list_new/Marker/OnBeforeMarkedKeyChanged/OnBeforeMarkedKeyChanged';

function getData() {
    return [
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
    ];
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _timeout: number;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData4: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    markerVisibility: 'visible',
                },
            },
        };
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

    protected _beforeMount(): void {
        this._timeout = +(query.get.timeout ? query.get.timeout : '1000');
    }
}
