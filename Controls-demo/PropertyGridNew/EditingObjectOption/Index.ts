import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-demo/PropertyGridNew/EditingObjectOption/EditingObjectOption';
import { IProperty as IPropertyGridItem } from 'Controls/propertyGrid';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { getEditingObject, getSource } from '../resources/Data';

export default class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _typeDescription: RecordSet<IPropertyGridItem> = null;
    protected _editingObject: Model<IPropertyGridItem> = null;

    protected _beforeMount(): void {
        this._editingObject = new Model<IPropertyGridItem>({
            rawData: getEditingObject(),
        });
        this._typeDescription = new RecordSet<IPropertyGridItem>({
            rawData: getSource(),
            keyProperty: 'name',
        });
    }
}
