import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UI/Vdom';
import { Memory } from 'Types/source';
import PortionedSearchMemory from 'Controls-demo/list_new/Searching/DataHelpers/PortionedSearchMemory';
import { setTimeoutMocker } from 'Controls-demo/Utils/SetTimeoutMocker';

import * as Template from 'wml!Controls-demo/list_new/Searching/PortionedSearchUpMocked/PortionedSearchUpMocked';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: PortionedSearchMemory = null;
    protected _filter: Object = null;
    protected _position: number = 0;
    protected _initialScrollPosition: object = {
        vertical: 'end',
    };
    protected _virtualScrollConfig: {};

    protected _fastFilterData: any;

    constructor(options?: object) {
        super(options);
        this._mockTimeouts();
    }

    private _mockTimeouts(): void {
        setTimeoutMocker.mock(30000, 5000);
    }

    protected _beforeMount(): void {
        this._viewSource = new PortionedSearchMemory({
            direction: 'up',
            keyProperty: 'key',
            deferSearchResponse: true,
            responseItemsCount: 5,
        });
        this._filter = {};
        this._virtualScrollConfig = { pageSize: 15 };
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
        if (count !== undefined) {
            this._viewSource.setResponseItemsCount(count);
        }
        this._viewSource.callDeferredResponse();
    }

    destroy(): void {
        super.destroy();
        setTimeoutMocker.destroy();
    }
}
