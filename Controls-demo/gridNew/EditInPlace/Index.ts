import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/EditInPlace/EditInPlace';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import EditInPlaceAlign from 'Controls-demo/gridNew/EditInPlace/Align/Index';
import EditInPlaceDragNDrop from 'Controls-demo/gridNew/EditInPlace/DragNDrop/Index';
import EditInPlaceDecorators from 'Controls-demo/gridNew/EditInPlace/Decorators/Index';
import EditInPlaceBackground from 'Controls-demo/gridNew/EditInPlace/Background/Index';
import EditInPlaceEditingRow from 'Controls-demo/gridNew/EditInPlace/EditingRow/Index';
import EditInPlaceEditingOnMounting from 'Controls-demo/gridNew/EditInPlace/EditingOnMounting/Index';
import EditInPlaceEditingRowEvents from 'Controls-demo/gridNew/EditInPlace/EditingRowEvents/Index';
import EditInPlaceEditingCell from 'Controls-demo/gridNew/EditInPlace/EditingCell/Index';
import EditInPlaceEditingTemplateFromColumn from 'Controls-demo/gridNew/EditInPlace/EditingTemplateFromColumn/Index';
import EditInPlaceEmptyActions from 'Controls-demo/gridNew/EditInPlace/EmptyActions/Index';
import EditInPlaceExcelStartColumnIndex from 'Controls-demo/gridNew/EditInPlace/Excel/StartColumnIndex/Index';
import EditInPlaceKeyboardControl from 'Controls-demo/gridNew/EditInPlace/KeyboardControl/Index';
import EditInPlaceSequentialEditingMode from 'Controls-demo/gridNew/EditInPlace/SequentialEditingMode/Index';
import EditInPlaceSingleCellEditable from 'Controls-demo/gridNew/EditInPlace/SingleCellEditable/Index';
import EditInPlaceSize from 'Controls-demo/gridNew/EditInPlace/Size/Index';
import EditInPlaceToolbar from 'Controls-demo/gridNew/EditInPlace/Toolbar/Index';
import EditInPlaceValidation from 'Controls-demo/gridNew/EditInPlace/Validation/Index';
import EditInPlaceViewTemplates from 'Controls-demo/gridNew/EditInPlace/ViewTemplates/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...EditInPlaceAlign.getLoadConfig(),
            ...EditInPlaceDragNDrop.getLoadConfig(),
            ...EditInPlaceDecorators.getLoadConfig(),
            ...EditInPlaceBackground.getLoadConfig(),
            ...EditInPlaceEditingRow.getLoadConfig(),
            ...EditInPlaceEditingOnMounting.getLoadConfig(),
            ...EditInPlaceEditingRowEvents.getLoadConfig(),
            ...EditInPlaceEditingCell.getLoadConfig(),
            ...EditInPlaceEditingTemplateFromColumn.getLoadConfig(),
            ...EditInPlaceEmptyActions.getLoadConfig(),
            ...EditInPlaceExcelStartColumnIndex.getLoadConfig(),
            ...EditInPlaceKeyboardControl.getLoadConfig(),
            ...EditInPlaceSequentialEditingMode.getLoadConfig(),
            ...EditInPlaceSingleCellEditable.getLoadConfig(),
            ...EditInPlaceSize.getLoadConfig(),
            ...EditInPlaceToolbar.getLoadConfig(),
            ...EditInPlaceValidation.getLoadConfig(),
            ...EditInPlaceViewTemplates.getLoadConfig(),
        };
    }
}
