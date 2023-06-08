import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/searchBreadcrumbsGrid/VirtualScroll/VirtualScroll';
import { Memory } from 'Types/source';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: unknown[] = [{ displayProperty: 'title' }];

    protected _beforeMount(): void {
        const COUNT_CHILD = 200;
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: [
                { key: 1, parent: null, node: true, title: 'Корневой узел' },
                ...this._generateData(1, COUNT_CHILD),
            ],
        });
    }

    private _generateData(parentKey: number, countChild: number): unknown[] {
        const data = [];
        for (let i = 0; i < countChild; i++) {
            const key = Number(`${parentKey}${i}`);
            data.push({
                key,
                parent: parentKey,
                node: true,
                title: `Хлебная крошка ${key}`,
            });
        }
        return data;
    }
}
