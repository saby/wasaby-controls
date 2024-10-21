import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import {
    getDataForComplexScroll,
    getFewCategories as getData,
} from '../../list_new/DemoHelpers/DataCatalog';
import { IDataConfig, IAreaDataFactoryArguments } from 'Controls/dataFactory';
import Template = require('wml!Controls-demo/SwitchableArea/Base/Template');
import listItem = require('wml!Controls-demo/SwitchableArea/resources/contentList');

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _items: object[] = [];
    protected _viewSource: Memory;
    protected _demoSelectedKey: string = 'first';

    protected _beforeMount(): void {
        this._items = [
            {
                key: 'first',
                itemTemplate: listItem,
                templateOptions: {
                    number: 1,
                    additionalOptions: true,
                },
            },
            {
                key: 'second',
                itemTemplate: listItem,
                templateOptions: {
                    number: 2,
                },
            },
        ];
    }

    protected clickHandler(e: Event, selectedKey: string): void {
        this._demoSelectedKey = selectedKey;
    }

    /**
     * Метод, имитирующий конфигурацию для предзагрузки данных.
     */
    static getLoadConfig(): Record<string, IDataConfig<IAreaDataFactoryArguments>> {
        return {
            areaData: {
                dataFactoryName: 'Controls/dataFactory:Area',
                dataFactoryArguments: {
                    initialKeys: ['first'],
                    configs: {
                        first: {
                            list: {
                                dataFactoryName: 'Controls/dataFactory:List',
                                dataFactoryArguments: {
                                    source: new Memory({
                                        keyProperty: 'key',
                                        data: getData(),
                                    }),
                                },
                            },
                        },
                        second: {
                            list: {
                                dataFactoryName: 'Controls/dataFactory:List',
                                dataFactoryArguments: {
                                    source: new Memory({
                                        keyProperty: 'key',
                                        data: getDataForComplexScroll(),
                                    }),
                                },
                            },
                        },
                    },
                },
            },
        };
    }
}
