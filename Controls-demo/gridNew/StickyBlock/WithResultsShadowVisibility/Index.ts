import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

import * as Template from 'wml!Controls-demo/gridNew/StickyBlock/WithResultsShadowVisibility/WithResultsShadowVisibility';

function getData() {
    return Countries.getData().map((it, index) => {
        return { ...it, group: 'Группа ' + Math.round(index / 10) };
    });
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _header: IHeaderCell[] = Countries.getHeader();
    protected _columns: IColumn[] = Countries.getColumnsWithWidths(false);

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            StickyBlockWithResultsShadowVisibility: {
                dataFactoryName: 'Controls/dataFactory:List',
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
