import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/list_new/Navigation/Paging/Basic/ResetButton/Template';
import PositionSourceMock from './PositionSourceMock';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

export default class extends Control {
    protected _template: TemplateFunction = template;
    protected _source: PositionSourceMock;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            PagingBasicResetButton: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new PositionSourceMock({
                        keyProperty: 'key',
                    }),
                    navigation: {
                        source: 'position',
                        view: 'infinity',
                        sourceConfig: {
                            field: 'key',
                            position: 0,
                            direction: 'bothways',
                            limit: 25,
                        },
                        viewConfig: {
                            pagingMode: 'basic',
                            showEndButton: 'true',
                            resetButtonMode: 'home',
                        },
                    },
                },
            },
        };
    }
}
