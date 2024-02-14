import { Control, TemplateFunction } from 'UI/Base';
import { StackOpener, Controller } from 'Controls/popup';
import * as Template from 'wml!Controls-demo/Popup/Loader/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _stackOpener: StackOpener = new StackOpener();
    protected _initializingWay: boolean = true;

    _openStack(): void {
        // Потому что в странице которая строит демки на WI не задал лоадер
        const popupManager = Controller.getManager();
        popupManager._dataLoaderModule = 'Controls-demo/DataLoader';

        this._stackOpener.open({
            template: 'Controls-demo/Popup/Loader/Template',
            width: 900,
            opener: this,
            initializingWay: this._initializingWay ? 'delayedRemote' : 'remote',
            dataLoaders: [
                [
                    {
                        module: 'Controls-demo/Popup/Loader/Loaders/recordLoader',
                        params: { kek: true },
                        dependencies: [],
                        await: false,
                    },
                    {
                        module: 'Controls-demo/Popup/Loader/Loaders/attachmentLoader',
                    },
                ],
            ],
            templateOptions: {
                loaders: {},
            },
            eventHandlers: {
                onClose: () => {
                    popupManager._dataLoaderModule = null;
                },
            },
        });
    }
}
