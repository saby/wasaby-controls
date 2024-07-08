import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Menu/Control/SubMenuMultiSelect/Index');
import { RecordSet } from 'Types/collection';
import { Control as MenuControl } from 'Controls/menu';

class Source extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _items: RecordSet;
    protected _children: {
        menuControl: MenuControl;
    };

    protected _beforeMount(): void {
        this._items = new RecordSet({
            rawData: [
                {
                    key: 1,
                    title: 'Настройки',
                    parent: null,
                    node: null,
                },
                {
                    key: 2,
                    title: 'Распечатать',
                    node: true,
                    parent: null,
                    subMenuTemplateOptions: {
                        multiSelect: true,
                    },
                },
                { key: 3, title: 'Отметить', node: null, parent: null },
                { key: 4, title: 'Отправить', node: null, parent: null },
                { key: 5, title: 'Удалить', node: null, parent: null },
                { key: 6, title: 'Акты', parent: 2 },
                { key: 7, title: 'Накладные', parent: 2 },
                { key: 8, title: 'Счета-фактуры', parent: 2 },
                { key: 9, title: 'Договоры', parent: 2 },
            ],
            keyProperty: 'key',
        });
    }

    protected _applyClick(): void {
        this._children.menuControl.closeSubMenu();
    }
}
export default Source;
