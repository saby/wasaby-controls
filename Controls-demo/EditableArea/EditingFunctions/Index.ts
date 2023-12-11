import { Record } from 'Types/entity';
import { main as editingObject } from '../Data';
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as template from 'wml!Controls-demo/EditableArea/EditingFunctions/EditingFunctions';

class EditingFunctions extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _editingObject: Record = editingObject;

    protected _beginEdit(): void {
        this._children.editingView.beginEdit();
    }

    protected _cancelEdit(): void {
        this._children.editingView.cancelEdit();
    }

    protected _commitEdit(): void {
        this._children.editingView.commitEdit();
    }
}
export default EditingFunctions;
