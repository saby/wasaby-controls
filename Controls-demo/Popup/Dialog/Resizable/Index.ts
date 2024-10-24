import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Popup/Dialog/Resizable/Index');
import { DialogOpener } from 'Controls/popup';

const baseStackConfig = {
    template: 'Controls-demo/Popup/Dialog/Resizable/Popup',
    closeOnOutsideClick: true,
    autofocus: true,
    opener: null,
};

class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _resizable: boolean = false;
    private _dialogOpener: DialogOpener;

    protected _afterMount(options?: IControlOptions, contexts?: any): void {
        this._dialogOpener = new DialogOpener(baseStackConfig);
    }

    protected _openDialogHandler(): void {
        this._dialogOpener.open({
            minWidth: 300,
            templateOptions: {
                resizable: this._resizable,
            },
        });
    }
}

export default Index;
