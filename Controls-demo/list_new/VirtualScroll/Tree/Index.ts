import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/list_new/VirtualScroll/Tree/Tree';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import PositionSourceMock from './PositionSourceMock';

export default class extends Control {
    protected _template: TemplateFunction = template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            VirtualScrollTree: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new PositionSourceMock({ keyProperty: 'key' }),
                    parentProperty: 'parent',
                    nodeProperty: 'node',
                    navigation: {
                        source: 'position',
                        view: 'infinity',
                        sourceConfig: {
                            field: 'key',
                            position: 0,
                            direction: 'forward',
                            limit: 20,
                        },
                    },
                },
            },
        };
    }
}
