import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Menu/Control/SubMenuMultiSelect/Index');
import { Memory } from 'Types/source';
import { Control as MenuControl } from 'Controls/menu';

class Source extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _source: Memory;
    protected _children: {
        menuControl: MenuControl;
    };

    protected _beforeMount(): void {
        this._source = new Memory({
            data: [
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
