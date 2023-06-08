import { Control, TemplateFunction } from 'UI/Base';
import {
    StackOpener,
    PageController as PopupPageController,
} from 'Controls/popup';
import * as Template from 'wml!Controls-demo/FormController/InitializingWay/Index';
import 'css!Controls-demo/FormController/InitializingWay/Index';
import { PageController } from 'Controls/dataSource';
import { Memory } from 'Types/source';
import Source from './Source';
import { SyntheticEvent } from 'UI/Vdom';
import { Model } from 'Types/entity';

PageController.getPageConfig = (pageId) => {
    return Promise.resolve(PAGE_CONFIGS[pageId]);
};

PageController.setDataLoaderModule(
    'Controls-demo/Popup/Page/Loaders/DataLoader'
);
PopupPageController.setPageTemplate(
    'Controls-demo/Popup/Page/PageTemplate/PageTemplate'
);

const PAGE_CONFIGS = {
    stackTemplate: {
        templateOptions: {
            prefetchConfig: {
                configLoader:
                    'Controls-demo/FormController/InitializingWay/ConfigLoader/ConfigLoader',
                configLoaderArguments: {},
            },
            workspaceConfig: {
                templateName:
                    'Controls-demo/FormController/InitializingWay/Popup/Template',
            },
        },
    },
};
const DATA = [
    {
        key: 1,
        regulation: 'Задача',
        milestone: '21.2100',
    },
    {
        key: 2,
        regulation: 'Ошибка',
        milestone: '21.3100',
    },
    {
        key: 3,
        regulation: 'Задача',
        milestone: '21.4100',
    },
    {
        key: 4,
        regulation: 'Ошибка',
        milestone: '21.5100',
    },
];
export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _stackOpener: StackOpener = new StackOpener();
    protected _initializingWay: string[] = ['preload'];
    protected _initializingWaySource: Memory = new Memory({
        keyProperty: 'key',
        data: [
            { key: 'preload' },
            { key: 'local' },
            { key: 'read' },
            { key: 'create' },
            { key: 'delayedRead' },
            { key: 'delayedCreate' },
        ],
    });
    protected _source: Source = new Source({
        keyProperty: 'key',
        data: DATA,
    });

    _openStack(event: SyntheticEvent, item: Model): void {
        this._stackOpener.open(this._getPopupConfig(item));
    }

    protected _getPopupConfig(item: Model) {
        const initializingWay = this._initializingWay[0];
        const cfg = {
            template:
                initializingWay === 'preload'
                    ? null
                    : 'Controls-demo/FormController/InitializingWay/Popup/Template',
            pageId: initializingWay === 'preload' ? 'stackTemplate' : null,
            width: 900,
            opener: this,
            templateOptions: {
                initializingWay,
                source: this._source,
            },
        };
        if (
            initializingWay !== 'create' &&
            initializingWay !== 'delayedCreate'
        ) {
            cfg.templateOptions.entityKey = item.getKey();
            cfg.templateOptions.record = item;
        }

        return cfg;
    }
}
