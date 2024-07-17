import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Popup/Dialog/PropStorageId/Index');
import { DialogOpener } from 'Controls/popup';

const baseStackConfig = {
    template: 'Controls-demo/Popup/Dialog/PropStorageId/Popup',
    closeOnOutsideClick: true,
    autofocus: true,
    opener: null,
};

class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    private _dialogOpener: DialogOpener;

    protected _afterMount(options?: IControlOptions, contexts?: any): void {
        this._dialogOpener = new DialogOpener(baseStackConfig);
    }

    protected _openDialogHandler(): void {
        this._dialogOpener.open({
            templateOptions: {
                resizable: true,
            },
            propStorageId: 'demoPropStorageId',
            minHeight: 200,
        });
    }
}

export default Index;
