import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/Navigation/Paging/EdgesUpDirection/EdgesUpDirection';
import { Memory } from 'Types/source';
import { generateData } from '../../../DemoHelpers/DataCatalog';

const MAX_ELEMENTS_COUNT: number = 100;
/**
 * Отображение пейджинга с одной командой прокрутки.
 * Отображается кнопка в конец, либо в начало, в зависимости от положения.
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _initialScrollPosition: object = {
        vertical: 'end',
    };
    private _dataArray: unknown = generateData({
        count: MAX_ELEMENTS_COUNT,
        entityTemplate: { title: 'lorem' },
    });
    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: this._dataArray,
        });
    }
}
