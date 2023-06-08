import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';

import * as Template from 'wml!Controls-demo/list_new/ColumnsView/Nested/Template';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import NestedColumnsComponent from 'Controls-demo/list_new/ColumnsView/Nested/Columns/Columns';

function getData() {
    return [
        {
            key: 1,
            title: 'Запись списка верхнего уровня. В шаблоне содержится вложенный многоколоночный список',
        },
    ];
}

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                },
            },
            ...NestedColumnsComponent.getLoadConfig(),
        };
    }
}
