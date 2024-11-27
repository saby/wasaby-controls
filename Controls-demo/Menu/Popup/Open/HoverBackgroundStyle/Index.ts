import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Menu/Popup/Open/HoverBackgroundStyle/Index');
import { RecordSet } from 'Types/collection';
import { StickyOpener } from 'Controls/popup';
import 'css!Controls-demo/Menu/Menu';
import { Button } from 'Controls/buttons';

class BackgroundStyle extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _children: {
        button: Button;
    };

    protected _openMenu(): void {
        const stickyOpener = new StickyOpener();
        stickyOpener.open({
            template: 'Controls/menu:Popup',
            templateOptions: {
                backgroundStyle: 'secondary',
                hoverBackgroundStyle: 'secondary',
                items: new RecordSet({
                    keyProperty: 'key',
                    rawData: [
                        { key: '1', title: 'Ярославль' },
                        { key: '2', title: 'Москва' },
                        { key: '3', title: 'Санкт-Петербург' },
                    ],
                }),
                keyProperty: 'key',
                displayProperty: 'title',
            },
            target: this._children.button,
            opener: this,
        });
    }
}
export default BackgroundStyle;
