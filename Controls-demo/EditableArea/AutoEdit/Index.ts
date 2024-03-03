import { Record } from 'Types/entity';
import { main as editingObject } from '../Data';
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as template from 'wml!Controls-demo/EditableArea/AutoEdit/AutoEdit';

class AutoEdit extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _editingObject: Record = editingObject;
}
export default AutoEdit;
