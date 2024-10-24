import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UI/Vdom';
import { Memory } from 'Types/source';
import { setTimeoutMocker } from 'Controls-demo/Utils/SetTimeoutMocker';

import PortionedSearchMemory from 'Controls-demo/list_new/Searching/DataHelpers/PortionedSearchMemory';

import * as Template from 'wml!Controls-demo/list_new/Searching/PortionedSearchMocked/PortionedSearchMocked';

/**
 * Демка для тестов, в которой мокаются таймауты
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: PortionedSearchMemory = null;
    protected _fastFilterData: object[];
    protected _filter: Object = null;
    protected _position: number = 0;
    protected _iterativeValue: boolean = true;
    protected _virtualScrollConfig = { pageSize: 15 };

    constructor(options?: object) {
        super(options);
        this._mockTimeouts();
    }

    private _mockTimeouts(): void {
        setTimeoutMocker.mock(30000, 5000);
    }

    protected _beforeMount(): void {
        this._viewSource = new PortionedSearchMemory({
            direction: 'down',
            keyProperty: 'key',
            deferSearchResponse: true,
            responseItemsCount: 5,
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
                        data: [
                            { id: 'few-items', title: 'Мало записей' },
                            {
                                id: 'many-items',
                                title: 'Много данных при поиске',
                            },
                        ],
                    }),
                    displayProperty: 'title',
                    keyProperty: 'id',
                },
                viewMode: 'frequent',
            },
        ];
    }

    protected _returnNRecordsAndContinueScenario(event: SyntheticEvent, count?: number): void {
        if (count) {
            this._viewSource.setResponseItemsCount(count);
        }
        this._viewSource.callDeferredResponse();
    }

    protected _returnAlreadyExistedRecord(): void {
        this._viewSource.setResponseAlreadyExistedRecord(true);
        this._viewSource.callDeferredResponse();
        this._viewSource.setResponseAlreadyExistedRecord(false);
    }

    protected _iterativeValueChanged(event: SyntheticEvent, value: boolean): void {
        this._iterativeValue = value;
        this._viewSource.setIterativeValue(value);
    }

    destroy(): void {
        super.destroy();
        setTimeoutMocker.destroy();
    }
}
