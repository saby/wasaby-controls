import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/EditInPlace/CancelEdit/CancelEdit';
import { Memory } from 'Types/source';
import { editing, View as List } from 'Controls/list';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { getFewCategories as getData } from '../../DemoHelpers/DataCatalog';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _children: {
        list: List;
    };
    private _isEditing: boolean = false;
    private _isCommitButtonPressed: boolean = false;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                },
            },
        };
    }

    protected _cancel(): void {
        this._isCommitButtonPressed = true;
        this._children.list.cancelEdit();
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
