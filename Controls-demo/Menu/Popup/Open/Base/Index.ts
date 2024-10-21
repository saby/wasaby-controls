import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Menu/Popup/Open/Base/Index');
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { StickyOpener } from 'Controls/popup';
import { Button } from 'Controls/buttons';
import 'css!Controls-demo/Menu/Menu';

class HeaderContentTemplate extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _caption: string = 'open menu';
    protected _selectedKey: string;
    protected _children: {
        button: Button;
    };

    protected _openMenu(event: Event): void {
        const stickyOpener = new StickyOpener();
        stickyOpener.open({
            template: 'Controls/menu:Popup',
            templateOptions: {
                selectedKeys: [this._selectedKey],
                markerVisibility: 'onactivated',
                source: new Memory({
                    keyProperty: 'key',
                    data: [
                        { key: '1', title: 'Ярославль' },
                        { key: '2', title: 'Москва' },
                        { key: '3', title: 'Санкт-Петербург' },
                    ],
                }),
                keyProperty: 'key',
                displayProperty: 'title',
            },
            eventHandlers: {
                onResult: (action: string, data: Model) => {
                    if (action === 'itemClick') {
                        this._selectedKey = data.getKey();
                        this._caption = data.get('title');
                    }
                    stickyOpener.close();
                },
            },
            target: this._children.button,
            opener: this,
        });
    }
}
export default HeaderContentTemplate;
