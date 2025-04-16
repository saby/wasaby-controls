import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { getFewCategories as getData } from '../../list_new/DemoHelpers/DataCatalog';
import { IDataConfig, IAreaDataFactoryArguments } from 'Controls/dataFactory';
import Template = require('wml!Controls-demo/SwitchableArea/SwitchData/Template');
import listItem = require('wml!Controls-demo/SwitchableArea/resources/contentList');
import { DataContext } from 'Controls-DataEnv/context';
import { Loader } from 'Controls-DataEnv/dataLoader';

export default class Demo extends Control {
    protected _template: TemplateFunction = Template;
    protected _items: object[] = [];
    protected _viewSource: Memory;
    protected _demoSelectedKey: string = 'first';
    protected _loadResult: Record<string, unknown>;
    protected _configs: Record<string, unknown>;

    protected _beforeMount(): void {
        this._loadResult = { areaData: this.context.areaData.state };
        this._configs = Demo.getLoadConfig();
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

    protected switchDataHandler(): void {
        const newConfig = Demo.getLoadConfig('description', 'title', this._demoSelectedKey);
        Loader.load(newConfig).then((newData) => {
            this._loadResult = newData;
            this._configs = newConfig;
        });
    }

    static contextType = DataContext;
    /**
     * Метод, имитирующий конфигурацию для предзагрузки данных.
     */
    static getLoadConfig(
        firstDisplayProperty,
        secondDisplayProperty,
        initialKey
    ): Record<string, IDataConfig<IAreaDataFactoryArguments>> {
        return {
            areaData: {
                dataFactoryName: 'Controls/dataFactory:Area',
                dataFactoryArguments: {
                    initialKeys: [initialKey || 'first'],
                    configs: {
                        first: {
                            list: {
                                dataFactoryName: 'Controls/dataFactory:List',
                                dataFactoryArguments: {
                                    displayProperty: firstDisplayProperty || 'title',
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
                                    displayProperty: secondDisplayProperty || 'description',
                                    source: new Memory({
                                        keyProperty: 'key',
                                        data: getData(),
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
