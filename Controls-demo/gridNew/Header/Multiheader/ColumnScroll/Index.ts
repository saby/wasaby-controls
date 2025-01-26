import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import * as Template from 'wml!Controls-demo/gridNew/Header/Multiheader/ColumnScroll/ColumnScroll';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { MultiHeader } from 'Controls-demo/gridNew/DemoHelpers/Data/MultiHeader';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Countries;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _header: IHeaderCell[] = MultiHeader.getHeader1();
    protected _columns: IColumn[] = Countries.getColumnsWithWidths();
    protected _stickyColumnsCount: number = 1;

    protected _beforeMount(
        options?: {},
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        super._beforeMount(options, contexts, receivedState);
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            MultiheaderColumnScroll: {
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
