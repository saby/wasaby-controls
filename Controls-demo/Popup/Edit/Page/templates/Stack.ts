import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import template = require('wml!Controls-demo/Popup/Edit/Page/templates/Stack');
import { RecordSet } from 'Types/collection';
import 'css!Controls-demo/Popup/Edit/Page/templates/Stack';

interface IStackOptions extends IControlOptions {
    prefetchResult: Record<string, any>;
}

export default class Stack extends Control<IStackOptions> {
    protected _template: TemplateFunction = template;
    protected _initializingWay: string = 'preload';
    protected _dataSource: Memory;
    protected _record: object;
    protected _isNewRecord: boolean;
    protected _listSource: RecordSet;

    protected _beforeMount(options?: IStackOptions): void {
        this._dataSource = options.viewSource;
        this._isNewRecord = !options.record;
        this._record = options.record;
        this._listSource = options.source;
    }

    protected _beforeUpdate(options?: IStackOptions): void {
        if (options.prefetchResult) {
            if (options.prefetchResult !== this._options.prefetchResult) {
                this._record = options.prefetchResult.data;
                options.hideIndicator();
            }
        }
        if (options.record !== this._options.record) {
            this._record = options.record;
        }
    }

    protected _update(): void {
        return this._children.formController.update();
    }

    protected _delete(): void {
        return this._children.formController.delete();
    }

    protected _deleteSuccessedHandler(): void {
        this._notify('close', [], { bubbling: true });
    }

    protected _updateSuccessedHandler(event: Event, record: Model): void {
        if (this._record === record) {
            this._notify('close', [], { bubbling: true });
        }
    }
}
