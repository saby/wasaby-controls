import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-demo/PropertyGridNew/ItemCaptionPosition/Index';
import {
    getEditingObject,
    getSource,
} from 'Controls-demo/PropertyGridNew/resources/Data';
import { object } from 'Types/util';

const CAPTION_POSITIONS = ['top', 'left', 'none'];

export default class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _editingObject: object;
    protected _typeDescription: object[];

    protected _beforeMount(): void {
        this._editingObject = getEditingObject();
        this._typeDescription = [];
        // убираю два редактора, чтобы не было прокрутки на странице демки
        // https://online.sbis.ru/opendoc.html?guid=243d874d-5129-4068-8dd2-6fb12d66e717
        const source = getSource();
        source.splice(0, 2);

        source.forEach((item) => {
            const name = item.name;

            CAPTION_POSITIONS.forEach((position) => {
                const itemClone = object.clone(item);
                const newName = name + position;
                itemClone.group = name;
                itemClone.name = newName;
                itemClone.captionPosition = position;

                const editingClone = object.clone(this._editingObject[name]);
                this._editingObject[newName] = editingClone;

                this._typeDescription.push(itemClone);
            });
        });
    }

    static _styles: string[] = ['Controls-demo/PropertyGridNew/PropertyGrid'];
}
