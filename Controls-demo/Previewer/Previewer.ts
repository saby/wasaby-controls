import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Previewer/Previewer');
import { Memory } from 'Types/source';
import { showType } from 'Controls/toolbars';
import { constants } from 'Env/Env';

class Previewer extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _triggerSource: Memory = null;
    protected _caption1: string = 'hover';
    protected _caption2: string = 'click';
    protected _trigger: string = 'hoverAndClick';
    protected _value: boolean = true;
    protected _selectedTrigger: string = 'hoverAndClick';
    protected _images: string[] = null;
    protected _text: string = 'Previewer has not opened yet';
    protected _resourceRoot: string;
    protected _defaultItemsWithoutToolbutton: object[];

    private _getMemorySource(items: object[]): Memory {
        return new Memory({
            keyProperty: 'id',
            data: items,
        });
    }
    private _closeHandler(): void {
        this._text = 'Previewer closed';
    }

    protected _beforeMount(): void {
        this._images = ['Andrey', 'Valera', 'Maksim'];

        this._resourceRoot = constants.resourceRoot;
        this._triggerSource = new Memory({
            keyProperty: 'title',
            data: [
                { title: 'hoverAndClick' },
                { title: 'hover' },
                { title: 'click' },
                { title: 'demand' },
            ],
        });
        this._defaultItemsWithoutToolbutton = [
            {
                id: '1',
                icon: 'icon-Print icon-medium',
                title: 'Распечатать',
                caption: 'Распечатать',
                viewMode: 'link',
                '@parent': false,
                parent: null,
            },
            {
                id: '2',
                viewMode: 'icon',
                icon: 'icon-Link icon-medium',
                title: 'Скопировать в буфер',
                '@parent': false,
                parent: null,
            },
            {
                id: '3',
                showType: showType.MENU,
                title: 'Прикрепить к',
                '@parent': false,
                parent: null,
            },
            {
                id: '4',
                showType: showType.MENU,
                title: 'Проекту',
                '@parent': false,
                parent: '3',
            },
            {
                id: '5',
                showType: showType.MENU,
                title: 'Этапу',
                '@parent': false,
                parent: '3',
            },
            {
                id: '6',
                icon: 'icon-medium icon-EmptyMessage',
                buttonStyle: 'secondary',
                showHeader: true,
                viewMode: 'link',
                iconStyle: 'secondary',
                buttonTransparent: false,
                title: 'Обсудить',
                '@parent': true,
                parent: null,
                readOnly: true,
            },
            {
                id: '7',
                showType: showType.MENU,
                title: 'Видеозвонок',
                '@parent': false,
                parent: '6',
            },
            {
                id: '8',
                showType: showType.MENU,
                title: 'Сообщение',
                '@parent': false,
                parent: '6',
            },
        ];
    }

    changeTrigger(e: Event, key: string): void {
        this._selectedTrigger = key;
        this._trigger = key;
    }

    private _clickHandler(event: Event, name: string): void {
        this._children[name].open('click');
    }

    static _styles: string[] = [
        'Controls-demo/InfoBox/resources/InfoboxButtonHelp',
        'Controls-demo/Previewer/Previewer',
    ];
}
export default Previewer;
