import { Memory } from 'Types/source';
import { SyntheticEvent } from 'UI/Vdom';
import { IEdgesData } from 'Controls/stickyEnvironment';
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { generateData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import * as template from 'wml!Controls-demo/StickyEnvironment/DataPinProvider/Events/Index';

export default class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    protected _topEdgeData: number;
    protected _bottomEdgeData: number;

    protected _viewSource: Memory;
    protected _navigation: object = {
        source: 'page',
        view: 'infinity',
        sourceConfig: {
            page: 10,
            pageSize: 50,
            hasMore: false,
        },
    };

    private _dataArray: { key: number; title: string }[] = generateData<{
        key: number;
        title: string;
    }>({
        count: 1000,
        entityTemplate: { title: 'lorem' },
    });

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: this._dataArray,
        });
    }

    protected _onEdgesDataChanged(
        event: SyntheticEvent,
        data: IEdgesData<number>
    ): void {
        this._topEdgeData = data.top.above || data.top.below;
        this._bottomEdgeData = data.bottom.above;
    }
}
