import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import Template = require('wml!Controls-demo/Toolbar/SubMenuTemplate/Template');
import { RecordSet } from 'Types/collection';
import { data } from '../resources/toolbarItems';
import { object } from 'Types/util';

class SubMenuTemplate extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _items: RecordSet;

    protected _beforeMount(): void {
        const items = object.clone(data.getDefaultItems());
        const item = items.find((item) => item.id === '4');
        item.subMenuTemplate = 'wml!Controls-demo/Toolbar/SubMenuTemplate/SubMenuTemplate';
        item.subMenuTemplateOptions = {
            subMenuCaption: 'Menu template',
            headingCaption: 'Шаблон меню',
        };

        this._items = new RecordSet({
            keyProperty: 'id',
            rawData: items,
        });
    }
}

export default SubMenuTemplate;
