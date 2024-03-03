import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import * as data from 'Controls-demo/Popup/Edit/Page/data/data';
import template = require('wml!Controls-demo/Popup/Edit/Page/Template');
import { PageController as PopupPageController, StackOpener } from 'Controls/popup';
import { PageController } from 'Controls/dataSource';
import * as RecordSynchronizer from 'Controls/Utils/RecordSynchronizer';
import { IndicatorOpener } from 'Controls/LoadingIndicator';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';
import 'wml!Controls-demo/Popup/Opener/resources/footer';
import 'wml!Controls-demo/List/Grid/DemoItem';
import 'wml!Controls-demo/List/Grid/DemoBalancePrice';
import 'wml!Controls-demo/List/Grid/DemoCostPrice';
import 'wml!Controls-demo/List/Grid/DemoHeaderCostPrice';
import 'wml!Controls-demo/List/Grid/DemoName';

PageController.getPageConfig = (pageId) => {
    return Promise.resolve(PAGE_CONFIGS[pageId]);
};

PopupPageController.setPageTemplate('Controls-demo/Popup/Page/PageTemplate/PageTemplate');
PageController.setDataLoaderModule('Controls-demo/Popup/Edit/Page/Loaders/DataLoader');

const PAGE_CONFIGS = {
    stackTemplate: {
        templateOptions: {
            prefetchConfig: {
                configLoader: 'Controls-demo/Popup/Edit/Page/Loaders/Stack',
                configLoaderArguments: {},
                objectMode: true,
            },
            workspaceConfig: {
                templateName: 'Controls-demo/Popup/Edit/Page/templates/Stack',
                templateOptions: {
                    hideIndicator(): void {
                        IndicatorOpener.hide(indicatorId);
                    },
                },
            },
        },
    },
};
let indicatorId;

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

const gridColumns = [
    {
        displayProperty: 'name',
        width: '1fr',
        template: 'wml!Controls-demo/List/Grid/DemoName',
    },
    {
        displayProperty: 'price',
        width: 'auto',
        align: 'right',
        template: 'wml!Controls-demo/List/Grid/DemoCostPrice',
    },
    {
        displayProperty: 'balance',
        width: 'auto',
        align: 'right',
        template: 'wml!Controls-demo/List/Grid/DemoBalancePrice',
    },
    {
        displayProperty: 'reserve',
        width: 'auto',
        align: 'right',
    },
    {
        displayProperty: 'costPrice',
        width: 'auto',
        align: 'right',
        template: 'wml!Controls-demo/List/Grid/DemoCostPrice',
    },
    {
        displayProperty: 'balanceCostSumm',
        width: 'auto',
        align: 'right',
        template: 'wml!Controls-demo/List/Grid/DemoCostPrice',
    },
];

const gridHeader = [
    {
        title: '',
    },
    {
        title: 'Цена',
        align: 'right',
    },
    {
        title: 'Остаток',
        align: 'right',
    },
    {
        title: 'Резерв',
        align: 'right',
    },
    {
        title: 'Себест.',
        align: 'right',
        template: 'wml!Controls-demo/List/Grid/DemoHeaderCostPrice',
    },
    {
        title: 'Сумма остатка',
        align: 'right',
    },
];

function getData() {
    return data.default.catalog;
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = template;
    protected _source: RecordSet;
    protected _gridColumns: object[] = gridColumns;
    protected _gridHeader: object[] = gridHeader;
    protected _items: RecordSet = null;
    private _stackOpener: StackOpener = new StackOpener();
    protected _beforeMount(): void {
        this._dataLoadCallback = this._dataLoadCallback.bind(this);
        this._resultHandler = this._resultHandler.bind(this);
        this._source = new RecordSet({
            rawData: [
                {
                    id: '1',
                    caption: 'Metro',
                },
                {
                    id: '2',
                    caption: 'Lenta',
                },
                {
                    id: '3',
                    caption: 'AzbukaVkusa',
                },
                {
                    id: '4',
                    caption: 'VkusVill',
                },
            ],
            format: [
                {
                    name: 'id',
                    type: 'string',
                },
                {
                    name: 'caption',
                    type: 'string',
                },
            ],
            keyProperty: 'id',
        });
    }

    protected _beforeUnmount(): void {
        this._stackOpener.destroy();
        this._stackOpener = null;
    }

    protected _createRecord(record: Model): Model {
        let newRecord;
        if (record) {
            // Создаем урезанный рекорд для эмуляции открытия записи с не полным форматом;
            newRecord = new Model({
                rawData: {
                    id: record.get('id'),
                    name: record.get('name'),
                    price: record.get('price'),
                    balance: record.get('balance'),
                    costPrice: record.get('costPrice'),
                },
                keyProperty: 'id',
            });
        }
        return newRecord;
    }

    protected _getOpenConfig(record?: Model): object {
        return {
            pageId: 'stackTemplate',
            opener: this,
            width: 400,
            templateOptions: {
                record: this._createRecord(record),
                viewSource: this._options._dataOptionsValue.PopupEdit.source,
                source: this._source,
            },
            eventHandlers: {
                onResult: this._resultHandler,
            },
        };
    }

    protected _resultHandler(optData: {
        formControllerEvent: string;
        record: Model;
        additionalData: { isNewRecord: boolean };
    }): void {
        if (optData.formControllerEvent === 'update') {
            if (optData.additionalData.isNewRecord) {
                RecordSynchronizer.addRecord(optData.record, { at: 0 }, this._items);
            } else {
                RecordSynchronizer.mergeRecord(
                    optData.record,
                    this._items,
                    optData.record.get('id')
                );
            }
        } else if (optData.formControllerEvent === 'delete') {
            RecordSynchronizer.deleteRecord(this._items, optData.record.get('id'));
        }
    }

    protected _clickHandler(event: Event, record: Model): void {
        // const options = this._getOpenConfig(record);
        // const meta = options.templateOptions;
        // this._children.EditOpener.open(meta, options);
        indicatorId = IndicatorOpener.show({ delay: 0 });
        this._stackOpener.open(this._getOpenConfig(record));
    }

    protected _addRecord(): void {
        // const options = this._getOpenConfig();
        // const meta = options.templateOptions;
        // this._children.EditOpener.open(meta, options);
        this._stackOpener.open(this._getOpenConfig());
    }

    protected _dataLoadCallback(items: RecordSet): void {
        this._items = items;
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            PopupEdit: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'id',
                        data: getData(),
                    }),
                    keyProperty: 'id',
                },
            },
        };
    },
});
