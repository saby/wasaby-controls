import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/Toolbar/BoxView/ToolbarBox';
import 'wml!Controls-demo/Toolbar/resources/customToolbarBoxTemplate';
import { Memory } from 'Types/source';
import { Record } from 'Types/entity';

class ToolbarBox extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _defaultSource: Memory;
    protected _currentClick: string;

    protected _beforeMount(): void {
        this._itemClick = this._itemClick.bind(this);
        this._defaultSource = new Memory({
            keyProperty: 'id',
            data: [
                {
                    id: '1',
                    caption: 'Конфигурация',
                    title: 'Конфигурация',
                    icon: 'icon-Settings',
                    iconStyle: 'secondary',
                },
                {
                    id: '2',
                    caption: 'AB',
                    myTemplate: 'wml!Controls-demo/Toolbar/resources/customToolbarBoxTemplate',
                },
                {
                    id: '3',
                    icon: 'icon-Bell',
                    iconStyle: 'secondary',
                },
            ],
        });
    }

    private _itemClick(event: Event, item: Record): void {
        this._currentClick = 'Вы нажали на ' + item.getId();
    }

    static _styles: string[] = ['Controls-demo/Toolbar/BoxView/ToolbarBox'];
}
export default ToolbarBox;
