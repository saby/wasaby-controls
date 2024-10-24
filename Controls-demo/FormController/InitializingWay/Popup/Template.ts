import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as Template from 'wml!Controls-demo/FormController/InitializingWay/Popup/Template';
import { Model } from 'Types/entity';
import { SyntheticEvent } from 'UI/Vdom';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _record: Model;
    protected _beforeMount({ record }: any): void {
        this._record = record;
    }
    protected _beforeUpdate({ initializingWay, prefetchResult, record }: any): void {
        if (initializingWay === 'preload' && prefetchResult !== this._options.prefetchResult) {
            this._record = prefetchResult.record;
        }
        if (record !== this._options.record) {
            this._record = record;
        }
    }
    protected _readSucessHandler(event: SyntheticEvent, record: Model): void {
        this._record = record;
    }
}
