import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Popup/SlidingPanel/Index/Index');
import { SlidingPanelOpener } from 'Controls/popup';
import { Memory } from 'Types/source';
import { SyntheticEvent } from 'UI/Vdom';

class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _isMobile: boolean = true;
    protected _heightListActivated: boolean = false;
    protected _minHeight: number = 300;
    protected _maxHeight: number = 700;
    protected _position: string[] = ['bottom'];
    protected _desktopMode: string[] = ['stack'];
    protected _desktopWidth: number = 900;
    protected _stepsCount: number = 5;
    protected _heightList: number[] = [300, 400, 500, 600, 700];
    protected _autoHeight: boolean = false;
    protected _modal: boolean = false;
    protected _popupTemplate: string = [
        'Controls-demo/Popup/SlidingPanel/PopupTemplate/Content/LargeContent',
    ];
    protected _desktopModeSource: Memory = new Memory({
        keyProperty: 'id',
        data: [{ id: 'stack' }, { id: 'dialog' }],
    });
    protected _positionSource: Memory = new Memory({
        keyProperty: 'id',
        data: [{ id: 'top' }, { id: 'bottom' }],
    });
    protected _templateSource: Memory = new Memory({
        keyProperty: 'id',
        data: [
            {
                id: 'Controls-demo/Popup/SlidingPanel/PopupTemplate/Content/Input',
                title: 'Поля ввода',
            },
            {
                id: 'Controls-demo/Popup/SlidingPanel/PopupTemplate/Content/LargeContent',
                title: 'Много контента',
            },
        ],
    });
    private _dialogOpener: SlidingPanelOpener;

    protected _afterMount(): void {
        this._dialogOpener = new SlidingPanelOpener({
            isAdaptive: !this._isMobile,
        });
    }
    protected _isMobileChanged(event: SyntheticEvent, value: boolean): void {
        this._isMobile = value;
        this._dialogOpener = new SlidingPanelOpener({
            isAdaptive: !this._isMobile,
        });
    }

    protected _selectedModeChanged(): void {
        this._dialogOpener = new SlidingPanelOpener({
            isAdaptive: !this._isMobile,
        });
    }

    protected _addHeightListStep(): void {
        this._stepsCount++;
    }

    protected _removeStep(event: SyntheticEvent<InputEvent>, index: number): void {
        this._heightList.splice(index, 1);
        this._stepsCount--;
        this._heightList = [...this._heightList];
    }

    protected _heightListInputValueChanged(
        event: SyntheticEvent<InputEvent>,
        index: number,
        value: number
    ): void {
        this._heightList[index] = value;
        this._heightList = [...this._heightList];
    }

    protected _openSlidingPanelHandler(event: Event, isInsideRestrictive: boolean): void {
        this._dialogOpener.open({
            template: 'Controls-demo/Popup/SlidingPanel/PopupTemplate',
            opener: this,
            modal: this._modal,
            desktopMode: this._desktopMode[0],
            slidingPanelOptions: {
                minHeight: this._heightListActivated ? undefined : this._minHeight,
                maxHeight: this._heightListActivated ? undefined : this._maxHeight,
                position: this._position[0],
                heightList: this._heightListActivated ? this._heightList : undefined,
                autoHeight: this._autoHeight,
            },
            dialogOptions: {
                width: this._desktopWidth,
            },
            templateOptions: {
                popupTemplate: this._popupTemplate[0],
            },
        });
    }
    static _styles: string[] = ['Controls-demo/Popup/SlidingPanel/Index/Index'];
}
export default Index;
