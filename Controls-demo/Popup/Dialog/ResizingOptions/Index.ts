import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { DialogOpener } from 'Controls/popup';
import { RecordSet } from 'Types/collection';
import controlTemplate = require('wml!Controls-demo/Popup/Dialog/ResizingOptions/Index');

const baseStackConfig = {
    template: 'Controls-demo/Popup/Dialog/ResizingOptions/Popup',
    closeOnOutsideClick: true,
    autofocus: true,
    opener: null,
};

class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _step: string = '1';
    protected _position: string = 'right-bottom';
    private _dialogOpener: DialogOpener;
    protected _itemsPosition: RecordSet;

    protected _beforeMount(): void {
        this._itemsPosition = new RecordSet({
            keyProperty: 'id',
            rawData: [
                {
                    id: 'left-top',
                    title: 'Левый верхний угол',
                },
                {
                    id: 'right-top',
                    title: 'Правый верхний угол',
                },
                {
                    id: 'left-bottom',
                    title: 'Левый нижний угол',
                },
                {
                    id: 'right-bottom',
                    title: 'Правый нижний угол',
                },
            ],
        });
    }

    protected _afterMount(options?: IControlOptions, contexts?: any): void {
        this._dialogOpener = new DialogOpener(baseStackConfig);
    }

    protected _openDialogHandler(): void {
        this._dialogOpener.open({
            minWidth: 300,
            maxWidth: 900,
            minHeight: 200,
            maxHeight: 500,
            templateOptions: {
                resizable: true,
                resizingOptions: {
                    step: this._step,
                    position: this._position,
                },
            },
        });
    }
}

export default Index;
