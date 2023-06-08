import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/EditInPlace/Validation/Validation';
import { Memory } from 'Types/source';
import 'wml!Controls-demo/gridNew/EditInPlace/Validation/_cellEditorEmail';
import 'wml!Controls-demo/gridNew/EditInPlace/Validation/_cellEditorLength';
import 'wml!Controls-demo/gridNew/EditInPlace/Validation/_cellEditorRequired';
import 'wml!Controls-demo/gridNew/EditInPlace/Validation/_cellEditorTitle';
import { ChangedChecker, LengthChecker } from './Custom';
import { getMoreActions } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { TItemsReadyCallback } from 'Controls-demo/types';
import { RecordSet } from 'Types/collection';
import { IItemAction } from 'Controls/itemActions';
import { Editing } from 'Controls-demo/gridNew/DemoHelpers/Data/Editing';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return Editing.getEditingValidationData();
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = Editing.getEditingColumnsValidation();
    protected _header: IHeaderCell[] = Editing.getEditingHeaderValidations();
    protected _markedKey: number;
    protected _dataLoadCallback: TItemsReadyCallback = this._dataCallback.bind(this);
    protected _items: RecordSet;
    protected _itemActions: IItemAction[] = [...getMoreActions()];

    private _dataCallback(items: RecordSet): void {
        this._items = items;
    }

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
}

export {LengthChecker, ChangedChecker};
