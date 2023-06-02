import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/EmptyGrid/WithHeader/WithHeader';
import { Memory } from 'Types/source';
import { IColumn, IFooterColumn } from 'Controls/grid';
import { IHeaderCell } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';

import 'wml!Controls-demo/gridNew/EmptyGrid/WithHeader/FooterCellTemplate';

const footerCfg: IFooterColumn[] = Countries.getColumns().map((c, index) => {
    return {
        template:
            'wml!Controls-demo/gridNew/EmptyGrid/WithHeader/FooterCellTemplate',
        templateOptions: {
            myVar: index,
        },
    };
});

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;

    protected _header: IHeaderCell[];
    protected _columns: IColumn[] = Countries.getColumns();
    protected _resultsPosition: string;
    protected _footerCfg: unknown[];
    protected _emptyTemplateOptions: any = {};

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: [],
        });
        this._toggleHeader();
        this._toggleFooter();
        this._toggleResults();
        this._dataLoadCallback = this._dataLoadCallback.bind(this);
    }

    private _dataLoadCallback(items: RecordSet): void {
        const results = new Model({
            // Устанавливаем адаптер для работы с данными, он будет соответствовать адаптеру RecordSet'а.
            adapter: items.getAdapter(),

            // Устанавливаем тип полей строки итогов.
            format: [
                { name: 'population', type: 'real' },
                { name: 'square', type: 'real' },
                { name: 'populationDensity', type: 'real' },
            ],
        });
        const data = Countries.getResults().full[0];

        results.set('population', data.population);
        results.set('square', data.square);
        results.set('populationDensity', data.populationDensity);

        items.setMetaData({
            ...items.getMetaData(),
            results,
        });
    }

    protected _toggleHeader(): void {
        this._header =
            this._header === undefined ? Countries.getHeader() : undefined;
    }

    protected _toggleResults(): void {
        this._resultsPosition =
            this._resultsPosition === undefined ? 'top' : undefined;
    }

    protected _toggleFooter(): void {
        this._footerCfg = this._footerCfg === undefined ? footerCfg : undefined;
    }

    protected _toggleHeight(): void {
        this._emptyTemplateOptions = {
            ...this._emptyTemplateOptions,
            height:
                this._emptyTemplateOptions?.height === 'auto'
                    ? 'stretch'
                    : 'auto',
        };
    }
}
