import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-TabsLayout-demo/Floating/Index';
import { getResourceUrl } from 'RequireJsLoader/conduct';
import 'css!Controls-TabsLayout-demo/Floating/Index';
import { RecordSet } from 'Types/collection';
import { constants } from 'Env/Env';

export default class FloatingTabsDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _items: RecordSet;

    protected _beforeMount(): void {
        const bgImage = getResourceUrl(
            constants.resourceRoot + 'Controls-TabsLayout-demo/Floating/Image/map.jpg'
        );
        this._items = new RecordSet({
            rawData: [
                {
                    id: 1,
                    title: 'На карте',
                    template: 'Controls-TabsLayout-demo/Floating/Template/Map',
                    backgroundImage: bgImage,
                },
                {
                    id: 2,
                    backgroundStyle: 'secondary',
                    title: 'Заявки',
                    mainCounter: 5,
                    template: 'Controls-TabsLayout-demo/Floating/Template/Request',
                },
            ],
            keyProperty: 'id',
        });
    }
}
