import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-TabsLayout-demo/Floating/Template/StackTemplate';
import { getResourceUrl } from 'RequireJsLoader/conduct';
import { RecordSet } from 'Types/collection';
import { constants } from 'Env/Env';

export default class StackTemplate extends Control<IControlOptions> {
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
                    title: 'На картеНа картеНа картеНа картеНа картеНа карте',
                    template: 'Controls-TabsLayout-demo/Floating/Template/Map',
                    maxWidth: 375,
                    minWidth: 250,
                    propStorageId: 'FloatingTabMap',
                    backgroundImage: bgImage,
                },
                {
                    id: 2,
                    title: 'ЗаявкиЗаявкиЗаявкиЗаявкиЗаявкиЗаявки',
                    mainCounter: 5,
                    template: 'Controls-TabsLayout-demo/Floating/Template/Request',
                },
            ],
            keyProperty: 'id',
        });
    }
}
