import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/EmptyGrid/WithHeader/WithHeader';
import { Memory } from 'Types/source';
import { IColumn, IFooterColumn, IHeaderCell } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

import 'wml!Controls-demo/gridNew/EmptyGrid/WithHeader/FooterCellTemplate';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const footerCfg: IFooterColumn[] = Countries.getColumns().map((c, index) => {
    return {
        template: 'wml!Controls-demo/gridNew/EmptyGrid/WithHeader/FooterCellTemplate',
        templateOptions: {
            myVar: index,
        },
    };
});

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _header: IHeaderCell[];
    protected _columns: IColumn[] = Countries.getColumns();
    protected _resultsPosition: string;
    protected _footerCfg: unknown[];
    protected _emptyTemplateOptions: any = {};

    protected _beforeMount(): void {
        this._toggleHeader();
        this._toggleFooter();
        this._toggleResults();
    }

    protected _toggleHeader(): void {
        this._header = this._header === undefined ? Countries.getHeader() : undefined;
    }

    protected _toggleResults(): void {
        this._resultsPosition = this._resultsPosition === undefined ? 'top' : undefined;
    }

    protected _toggleFooter(): void {
        this._footerCfg = this._footerCfg === undefined ? footerCfg : undefined;
    }

    protected _toggleHeight(): void {
        this._emptyTemplateOptions = {
            ...this._emptyTemplateOptions,
            height: this._emptyTemplateOptions?.height === 'auto' ? 'stretch' : 'auto',
        };
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            EmptyGridWithHeader: {
                dataFactoryName: 'Controls-demo/gridNew/EmptyGrid/WithHeader/CustomFactory',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: [],
                    }),
                },
            },
        };
    }
}
