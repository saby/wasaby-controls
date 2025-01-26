import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { Memory } from 'Types/source';
import { IContextOptionsValue } from 'Controls/context';
import * as template from 'wml!Controls-demo/PropertyGridNew/Preload/Preload';
import 'css!Controls-demo/PropertyGridNew/PropertyGrid';

interface IPreloadOptions extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

export default class Preload extends Control<IPreloadOptions> {
    protected _template: TemplateFunction = template;
    protected _editingObject: object;
    protected _typeDescription: object[];
    protected _selectedKeys: number[] = [1];
    protected _source: Memory = null;
    protected _selectorTemplate: TemplateFunction = null;

    protected _beforeMount(options: IPreloadOptions): void {
        this._typeDescription = options._dataOptionsValue.propertyGrid.typeDescription;
        this._editingObject = options._dataOptionsValue.propertyGrid.editingObject;
        this._source = new Memory({
            keyProperty: 'id',
            data: [
                {
                    id: 1,
                    title: 'Наша компания',
                },
                {
                    id: 2,
                    title: 'Все юридические лица',
                },
                {
                    id: 3,
                    title: 'Инори, ООО',
                },
            ],
        });
        this._selectorTemplate = {
            templateName:
                'Controls-demo/LookupNew/Input/SelectorTemplate/resources/SelectorTemplate',
            templateOptions: {
                headingCaption: 'Выберите организацию',
            },
            popupOptions: {
                width: 500,
                height: 500,
            },
            mode: 'dialog',
        };
    }
}
