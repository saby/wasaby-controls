import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/HorizontalScroll/HorizontalScroll';
import * as headerTemplate from 'wml!Controls-demo/gridNew/HorizontalScroll/HeaderTemplate';
import * as columnTemplate from 'wml!Controls-demo/gridNew/HorizontalScroll/ColumnTemplate';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { Memory } from 'Types/source';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

const SHOWED_DEMOS = {
    VIRTUALIZATION_OFF_CHECKBOX_ON: true,
    VIRTUALIZATION_OFF_CHECKBOX_OFF: true,
    VIRTUALIZATION_ON_CHECKBOX_ON: true,
    VIRTUALIZATION_ON_CHECKBOX_OFF: true,
    LOAD: true,
};

export default class extends Control {
    private SHOWED_DEMOS: typeof SHOWED_DEMOS = SHOWED_DEMOS;
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _header: IHeaderCell[] = this._multiplyColumns(
        Countries.getHeader(),
        20,
        'pseudo',
        headerTemplate
    );
    protected _columns: IColumn[] = this._multiplyColumns(
        Countries.getColumnsWithWidths(),
        20,
        'pseudo',
        columnTemplate
    );
    protected _stickyColumnsCount: number = 1;

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: this._getData('key', 30),
        });
    }

    private _multiplyColumns<T extends {}[]>(
        columns: T,
        count: number,
        displayProperty: string,
        template: TemplateFunction
    ): T {
        const res = [
            ...columns.slice(1, columns.length).map((c) => {
                return { ...c };
            }),
        ] as T;
        for (let i = 0; i < count - 1; i++) {
            res.push(
                ...columns.map((c, idx) => {
                    return {
                        ...c,
                        [displayProperty]: `Column ${columns.length * i + idx}`,
                        template,
                        width: 'auto',
                    };
                })
            );
        }
        return res;
    }

    private _getData(keyProperty: string, count: number): object[] {
        const res = [];
        const data = Countries.getData();
        for (let i = 0; i < count; i++) {
            res.push({ ...data[i % data.length], number: i });
            res[i][keyProperty] = i;
        }
        return res;
    }
}
