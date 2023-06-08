import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/Searching/PortionedSearch/PortionedSearch';
import PortionedSearchMemory from 'Controls-demo/list_new/Searching/DataHelpers/PortionedSearchMemory';
import { SyntheticEvent } from 'UI/Vdom';
import { Memory } from 'Types/source';
import RecordSet from 'Types/collection';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: PortionedSearchMemory = null;
    protected _fastFilterData: object[];
    protected _filter: Object = null;
    protected _position: number = 0;

    protected _itemsCounter: number = 0;

    protected _longLoad: boolean = false;
    protected _fastLoad: boolean = false;
    protected _moreDataOnLoad: boolean = false;

    protected _beforeMount(): void {
        this._dataLoadCallback = this._dataLoadCallback.bind(this);
        this._viewSource = new PortionedSearchMemory({
            direction: 'down',
            keyProperty: 'key',
        });
        this._filter = {};
        this._fastFilterData = [
            {
                name: 'filter',
                value: null,
                resetValue: null,
                emptyText: 'Все',
                editorOptions: {
                    source: new Memory({
                        keyProperty: 'id',
                        data: [{ id: 'few-items', title: 'Мало записей' }],
                    }),
                    displayProperty: 'title',
                    keyProperty: 'id',
                },
                viewMode: 'frequent',
            },
        ];
    }

    protected _dataLoadCallback(items: RecordSet, direction: string): void {
        const originalMeta = items.getMetaData();
        if (!direction) {
            this._itemsCounter = items.getCount();
        } else {
            this._itemsCounter += items.getCount();
        }
        items.setMetaData({ ...originalMeta, counter: this._itemsCounter });
    }

    protected _longLoadChangedHandler(
        event: SyntheticEvent,
        newValue: boolean
    ): void {
        this._viewSource.setLongLoad(newValue);
        this._fastLoad = false;
        this._moreDataOnLoad = false;
    }

    protected _fastLoadChangedHandler(
        event: SyntheticEvent,
        newValue: boolean
    ): void {
        this._viewSource.setFastLoad(newValue);
        this._longLoad = false;
        this._moreDataOnLoad = false;
    }

    protected _moreDataOnLoadChangedHandler(
        event: SyntheticEvent,
        newValue: boolean
    ): void {
        this._viewSource.setMoreDataOnLoad(newValue);
        this._fastLoad = false;
        this._longLoad = false;
    }
}
