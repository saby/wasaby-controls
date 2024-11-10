import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import 'css!Controls/masterDetail';
import 'css!Controls/CommonClasses';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import { master } from 'Controls-demo/MasterDetail/Data';

import * as Template from 'wml!Controls-demo/MasterDetail/MasterResults/Master';
import * as numberResultTpl from 'wml!Controls-demo/gridNew/resources/ResultCellTemplates/Number';

function getData() {
    return master;
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: IColumn[] = [
        {
            displayProperty: 'name',
            width: '1fr',
        },
        {
            displayProperty: 'counter',
            width: 'auto',
            resultTemplate: numberResultTpl,
            result: '100000',
        },
    ];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            master: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'id',
                        data: getData(),
                    }),
                    keyProperty: 'id',
                    markerVisibility: 'hidden',
                    multiSelectVisibility: 'onhover',
                },
            },
        };
    }
}
