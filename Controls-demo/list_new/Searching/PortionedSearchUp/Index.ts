import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/Searching/PortionedSearchUp/PortionedSearchUp';
import PortionedSearchMemory from 'Controls-demo/list_new/Searching/DataHelpers/PortionedSearchMemory';
import { SyntheticEvent } from 'UI/Vdom';
import { Memory } from 'Types/source';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: PortionedSearchMemory = null;
    protected _filter: Object = null;
    protected _position: number = 0;
    protected _initialScrollPosition: object = {
        vertical: 'end',
    };
    protected _navigation = {
        source: 'position',
        view: 'infinity',
        sourceConfig: {
            field: 'key',
            position: this._position,
            direction: 'backward',
            limit: 15,
        },
    };

    protected _longLoad: boolean = false;
    protected _fastLoad: boolean = false;
    private _fastFilterData: unknown;

    protected _beforeMount(): void {
        this._viewSource = new PortionedSearchMemory({
            direction: 'up',
            immediateResult: true,
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

    protected _longLoadChangedHandler(event: SyntheticEvent, newValue: boolean): void {
        this._viewSource.setLongLoad(newValue);
        this._fastLoad = false;
    }

    protected _fastLoadChangedHandler(event: SyntheticEvent, newValue: boolean): void {
        this._viewSource.setFastLoad(newValue);
        this._longLoad = false;
    }
}
