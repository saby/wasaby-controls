import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/EditInPlace/EditInPlace';

import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import EditInPlaceAddingItemInPosition from 'Controls-demo/treeGridNew/EditInPlace/AddingItemInPosition/Index';
import EditInPlaceAddInNode from 'Controls-demo/treeGridNew/EditInPlace/AddInNode/Index';
import EditInPlaceColspan from 'Controls-demo/treeGridNew/EditInPlace/Colspan/Index';
import EditInPlaceEditingCell from 'Controls-demo/treeGridNew/EditInPlace/EditingCell/Index';
import EditInPlaceInputFontSize from 'Controls-demo/treeGridNew/EditInPlace/InputFontSize/Index';
import EditInPlaceRowEditor from 'Controls-demo/treeGridNew/EditInPlace/RowEditor/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...EditInPlaceAddingItemInPosition.getLoadConfig(),
            ...EditInPlaceAddInNode.getLoadConfig(),
            ...EditInPlaceColspan.getLoadConfig(),
            ...EditInPlaceEditingCell.getLoadConfig(),
            ...EditInPlaceInputFontSize.getLoadConfig(),
            ...EditInPlaceRowEditor.getLoadConfig(),
        };
    }
}
