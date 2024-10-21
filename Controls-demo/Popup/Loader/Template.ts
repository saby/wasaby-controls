import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as Template from 'wml!Controls-demo/Popup/Loader/Template';
import { Logger } from 'UI/Utils';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';

interface IOptions extends IControlOptions {
    isPrefetchDataMode: boolean;
    prefetchData: Record<string, unknown>;
}

const LOADER_MAP = {
    RECORD: 'Controls-demo/Popup/Loader/Loaders/recordLoader',
    ATTACHMENT: 'Controls-demo/Popup/Loader/Loaders/attachmentLoader',
};

export default class extends Control<IOptions> {
    protected _template: TemplateFunction = Template;
    protected _record: Model;
    protected _attachments: RecordSet;

    protected _beforeMount(options: IOptions): void {
        if (!options.isPrefetchDataMode) {
            Logger.warn('Устаревший режим. Данные никто не загрузит');
        }
        if (options.prefetchData) {
            this._updateByPrefetchData(options.prefetchData);
        }
    }

    protected _beforeUpdate(options: IOptions): void {
        if (options.prefetchData !== this._options.prefetchData) {
            this._updateByPrefetchData(options.prefetchData);
        }
    }

    private _updateByPrefetchData(prefetchData: Record<string, unknown>): void {
        this._attachments = prefetchData[LOADER_MAP.ATTACHMENT];
        this._record = prefetchData[LOADER_MAP.RECORD];
    }
}
