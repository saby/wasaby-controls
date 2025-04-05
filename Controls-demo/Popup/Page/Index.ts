import { Control, TemplateFunction } from 'UI/Base';
import { StackOpener, PageController as PopupPageController } from 'Controls/popup';
import * as Template from 'wml!Controls-demo/Popup/Page/Index';
import { Memory } from 'Types/source';
import { PageController } from 'Controls/dataSource';

const WIDGETS_COUNT = 50;

PageController.getPageConfig = (pageId) => {
    return Promise.resolve(PAGE_CONFIGS[pageId]);
};

PageController.setDataLoaderModule('Controls-demo/Popup/Page/Loaders/DataLoader');
PopupPageController.setPageTemplate('Controls-demo/Popup/Page/PageTemplate/PageTemplate');

const WIDGET_SOURCE = [];

for (let i = 0; i < WIDGETS_COUNT; i++) {
    WIDGET_SOURCE.push({
        key: i,
        title: 'Widget number ' + i,
        info: 'This is long info about this widget '.repeat(i + 1),
    });
}
const PAGE_CONFIGS = {
    stackTemplate: {
        templateOptions: {
            prefetchConfig: {
                configLoader: 'Controls-demo/Popup/Page/Loaders/Stack',
                configLoaderArguments: {},
            },
            workspaceConfig: {
                templateName: 'Controls-demo/Popup/Page/templates/Stack',
            },
        },
    },
};

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _stackOpener: StackOpener = new StackOpener();

    _openStack(): void {
        this._stackOpener.open({
            pageId: 'stackTemplate',
            opener: this,
            width: 900,
            templateOptions: {
                preloadWidgetsCount: 15,
                widgetSource: new Memory({
                    keyProperty: 'key',
                    data: WIDGET_SOURCE,
                }),
            },
        });
    }
}
