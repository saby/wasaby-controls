import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/list_new/Navigation/Paging/Basic/ResetButton/Template';
import PositionSourceMock from './PositionSourceMock';

export default class extends Control {
    protected _template: TemplateFunction = template;
    protected _source: PositionSourceMock;
    protected _position: number = 0;

    protected _beforeMount(): void {
        this._source = new PositionSourceMock({ keyProperty: 'key' });
    }
}

