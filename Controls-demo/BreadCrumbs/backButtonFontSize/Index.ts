import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/BreadCrumbs/backButtonFontSize/Template');
import { Model } from 'Types/entity';

class DemoControl extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;

    protected _items: Model[];

    protected _beforeMount(): void {
        this._items = [
            { id: 1, title: 'Первая папка', parent: null },
            { id: 2, title: 'Вторая папка', parent: 1 },
            { id: 3, title: 'Третья папка', parent: 2 },
        ].map((item) => {
            return new Model({
                rawData: item,
                keyProperty: 'id',
            });
        });
    }
}

export default DemoControl;
