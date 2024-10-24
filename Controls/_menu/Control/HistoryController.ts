/**
 * @kaizen_zone 36b6051b-790d-4170-b31c-ecc1485a7232
 */
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { TKey } from 'Controls/interface';
import { ICrud } from 'Types/source';

export interface IHistoryControllerOptions {
    source: ICrud;
    keyProperty: string;
}

export default class HistoryController {
    protected _source: ICrud = null;
    protected _options: IHistoryControllerOptions;

    constructor(options: IHistoryControllerOptions) {
        this._options = options;
        this._source = options.source;
    }

    togglePin(item: Model): Promise<void | Error> {
        const originalItem = HistoryController._getOriginalItem(
            item,
            this._options.keyProperty,
            this._source
        );
        return this._source
            .update(originalItem, {
                $_pinned: !originalItem.get('pinned'),
            })
            .catch((error: Error) => {
                return error;
            });
    }

    getItems(): RecordSet {
        return this._source.getItems();
    }

    getHistoryId(): string {
        return this._source.getHistoryId();
    }

    getRoot(): TKey {
        return this._source.getRoot();
    }

    updateItems(items: Model[]): Promise<RecordSet> {
        return this._options.source
            .update(items, {
                $_history: true,
            })
            .then(() => {
                return this.getItems();
            });
    }

    private static _getOriginalItem(
        item: Model,
        keyProperty: string,
        source: ICrud,
    ): Model {
        return source.resetHistoryFields(item, keyProperty);
    }
}
