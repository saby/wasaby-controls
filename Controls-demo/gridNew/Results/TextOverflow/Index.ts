import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

import * as Template from 'wml!Controls-demo/gridNew/Results/TextOverflow/TextOverflow';
import * as sqResTpl from 'wml!Controls-demo/gridNew/Results/TextOverflow/resultCell';
import * as defResTpl from 'wml!Controls-demo/gridNew/Results/TextOverflow/resultCellDefault';

const MAXITEM = 10;

function getData() {
    return Countries.getData().slice(0, MAXITEM);
}

interface IColumnWithResult extends IColumn {
    result: string | number;
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumnWithResult[] = [
        {
            displayProperty: 'country',
            width: 'auto',
            textOverflow: 'ellipsis',
            align: 'right',
            result: undefined,
        },
        {
            displayProperty: 'square',
            width: 'auto',
            textOverflow: 'ellipsis',
            result: undefined,
            align: 'right',
            resultTemplate: sqResTpl,
        },
        {
            displayProperty: 'population',
            width: 'auto',
            textOverflow: 'ellipsis',
            result: undefined,
            align: 'right',
            resultTemplate: defResTpl,
        },
        {
            displayProperty: 'populationDensity',
            width: 'min-content',
            textOverflow: 'ellipsis',
            align: 'right',
            result: undefined,
        },
    ];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ResultsTextOverflow: {
                dataFactoryName: 'Controls-demo/gridNew/Results/TextOverflow/CustomFactory',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                },
            },
        };
    }
}
