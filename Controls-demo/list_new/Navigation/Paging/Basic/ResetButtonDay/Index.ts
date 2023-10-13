import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/list_new/Navigation/Paging/Basic/ResetButtonDay/Template';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import PositionSourceMock from './PositionSourceMock';

export default class extends Control {
    protected _template: TemplateFunction = template;
    protected _position: number = 0;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            NavigationPagingBasicResetButtonDay: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new PositionSourceMock({ keyProperty: 'key' }),
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
                            resetButtonMode: 'day',
                            _date: '15',
                        },
                    },
                },
            },
        };
    }
}
