import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/EditInPlace/EditInPlace';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import EditInPlaceAddingEmptyKey from 'Controls-demo/list_new/EditInPlace/AddingEmptyKey/Index';
import EditInPlaceAddItem from 'Controls-demo/list_new/EditInPlace/AddItem/Index';
import EditInPlaceAfterEdit from 'Controls-demo/list_new/EditInPlace/AfterEdit/Index';
import EditInPlaceAddItemInEnd from 'Controls-demo/list_new/EditInPlace/AddItemInEnd/Index';
import EditInPlaceAddItemInBegin from 'Controls-demo/list_new/EditInPlace/AddItemInBegin/Index';
import EditInPlaceAutoAddOnInit from 'Controls-demo/list_new/EditInPlace/AutoAddOnInit/Index';
import EditInPlaceAutoAdd from 'Controls-demo/list_new/EditInPlace/AutoAdd/Index';
import EditInPlaceAutoAddOnMount from 'Controls-demo/list_new/EditInPlace/AutoAddOnMount/Index';
import EditInPlaceBackground from 'Controls-demo/list_new/EditInPlace/Background/Index';
import EditInPlaceBase from 'Controls-demo/list_new/EditInPlace/Base/Index';
import EditInPlaceCancelEdit from 'Controls-demo/list_new/EditInPlace/CancelEdit/Index';
import EditInPlaceBeginEdit from 'Controls-demo/list_new/EditInPlace/BeginEdit/Index';
import EditInPlaceCommitEdit from 'Controls-demo/list_new/EditInPlace/CommitEdit/Index';
import EditInPlaceEditingOnMounting from 'Controls-demo/list_new/EditInPlace/EditingOnMounting/Index';
import EditInPlaceEmptyActionsWithToolBar from 'Controls-demo/list_new/EditInPlace/EmptyActionsWithToolBar/Index';
import EditInPlaceDifferentItemActions from 'Controls-demo/list_new/EditInPlace/DifferentItemActions/Index';
import EditInPlaceEditByItemAction from 'Controls-demo/list_new/EditInPlace/EditByItemAction/Index';
import EditInPlaceEnabled from 'Controls-demo/list_new/EditInPlace/Enabled/Index';
import EditInPlaceEndEdit from 'Controls-demo/list_new/EditInPlace/EndEdit/Index';
import EditInPlaceGrouped from 'Controls-demo/list_new/EditInPlace/Grouped/Index';
import EditInPlaceGroupedEmptySource from 'Controls-demo/list_new/EditInPlace/GroupedEmptySource/Index';
import EditInPlaceNoAutoAddByApplyButton from 'Controls-demo/list_new/EditInPlace/NoAutoAddByApplyButton/Index';
import EditInPlaceSelectOnClick from 'Controls-demo/list_new/EditInPlace/SelectOnClick/Index';
import EditInPlaceNotEditableBySelector from 'Controls-demo/list_new/EditInPlace/NotEditableBySelector/Index';
import EditInPlaceSequentialEditing from 'Controls-demo/list_new/EditInPlace/SequentialEditing/Index';
import EditInPlaceSkipItem from 'Controls-demo/list_new/EditInPlace/SkipItem/Index';
import EditInPlaceSizeValue from 'Controls-demo/list_new/EditInPlace/SizeValue/Index';
import EditInPlaceSlowAdding from 'Controls-demo/list_new/EditInPlace/SlowAdding/Index';
import EditInPlaceTextArea from 'Controls-demo/list_new/EditInPlace/TextArea/Index';
import EditInPlaceToolbar from 'Controls-demo/list_new/EditInPlace/Toolbar/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...EditInPlaceAddingEmptyKey.getLoadConfig(),
            ...EditInPlaceAddItem.getLoadConfig(),
            ...EditInPlaceAfterEdit.getLoadConfig(),
            ...EditInPlaceAddItemInEnd.getLoadConfig(),
            ...EditInPlaceAddItemInBegin.getLoadConfig(),
            ...EditInPlaceAutoAddOnInit.getLoadConfig(),
            ...EditInPlaceAutoAdd.getLoadConfig(),
            ...EditInPlaceAutoAddOnMount.getLoadConfig(),
            ...EditInPlaceBackground.getLoadConfig(),
            ...EditInPlaceBase.getLoadConfig(),
            ...EditInPlaceCancelEdit.getLoadConfig(),
            ...EditInPlaceBeginEdit.getLoadConfig(),
            ...EditInPlaceCommitEdit.getLoadConfig(),
            ...EditInPlaceEditingOnMounting.getLoadConfig(),
            ...EditInPlaceEmptyActionsWithToolBar.getLoadConfig(),
            ...EditInPlaceDifferentItemActions.getLoadConfig(),
            ...EditInPlaceEditByItemAction.getLoadConfig(),
            ...EditInPlaceEnabled.getLoadConfig(),
            ...EditInPlaceEndEdit.getLoadConfig(),
            ...EditInPlaceGrouped.getLoadConfig(),
            ...EditInPlaceGroupedEmptySource.getLoadConfig(),
            ...EditInPlaceNoAutoAddByApplyButton.getLoadConfig(),
            ...EditInPlaceSelectOnClick.getLoadConfig(),
            ...EditInPlaceNotEditableBySelector.getLoadConfig(),
            ...EditInPlaceSequentialEditing.getLoadConfig(),
            ...EditInPlaceSkipItem.getLoadConfig(),
            ...EditInPlaceSizeValue.getLoadConfig(),
            ...EditInPlaceSlowAdding.getLoadConfig(),
            ...EditInPlaceTextArea.getLoadConfig(),
            ...EditInPlaceToolbar.getLoadConfig(),
        };
    }
}
