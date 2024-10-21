import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Menu/Control/IconSize/Index');
import { RecordSet } from 'Types/collection';

class IconSize extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _items: RecordSet;

    protected _beforeMount(): void {
        this._items = new RecordSet({
            rawData: [
                { key: 1, title: 'Work phone', icon: 'icon-PhoneWork' },
                { key: 2, title: 'Mobile phone', icon: 'icon-PhoneCell' },
                { key: 3, title: 'Home phone', icon: 'icon-Home' },
                { key: 4, title: 'Telegram', icon: 'icon-Telegram' },
                { key: 5, title: 'e-mail', icon: 'icon-Email' },
                { key: 6, title: 'Skype', icon: 'icon-Skype' },
                { key: 7, title: 'ICQ', icon: 'icon-Icq' },
            ],
            keyProperty: 'key',
        });
    }

    static _styles: string[] = ['Controls-demo/Menu/Menu'];
}
export default IconSize;
