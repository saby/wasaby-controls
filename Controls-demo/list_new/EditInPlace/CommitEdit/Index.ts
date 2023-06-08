import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/EditInPlace/CommitEdit/CommitEdit';
import { Memory } from 'Types/source';
import { View as List, editing } from 'Controls/list';
import { getFewCategories as getData } from '../../DemoHelpers/DataCatalog';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    private _isEditing: boolean = false;
    private _isCommitButtonPressed: boolean = false;

    protected _children: {
        list: List;
    };

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: getData(),
        });
    }

    protected _commit(): void {
        this._isCommitButtonPressed = true;
        this._children.list.commitEdit();
    }

    protected _onAfterBeginEdit(): void {
        this._isEditing = true;
    }

    protected _onBeforeEndEdit(): typeof editing.CANCEL | void {
        if (!this._isCommitButtonPressed) {
            return editing.CANCEL;
        }
    }

    protected _onAfterEndEdit(): void {
        this._isEditing = false;
        this._isCommitButtonPressed = false;
    }
}
