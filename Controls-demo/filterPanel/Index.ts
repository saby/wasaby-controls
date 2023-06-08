import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/filterPanel/Index';
import { IFilterItem } from 'Controls/filter';
import { Memory } from 'Types/source';
import { markerListConfig } from 'Controls-demo/filterPanel/ListEditor/MarkerStyle/Index';
import { emptyKeyConfig } from 'Controls-demo/filterPanel/EmptyKey/Index';
import {
    companyEditor,
    extendedCompanyEditor,
    emptyCompanyEditor,
    dropdownBasicConfig,
    typeEditor,
    textConfig,
    companyEditorWithoutExpander,
    multiSelectCompanyEditor,
    typeEditorData,
    companyEditorWithoutCaption,
} from 'Controls-demo/filterPanelPopup/Sticky/resources/Data';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory = new Memory({
        data: typeEditorData,
        keyProperty: 'id',
    });
    protected _basicItems: IFilterItem[] = [
        markerListConfig,
        emptyCompanyEditor,
        multiSelectCompanyEditor,
        companyEditorWithoutExpander,
        companyEditorWithoutCaption,
    ];
    protected _extendedItems: IFilterItem[] = [
        typeEditor,
        extendedCompanyEditor,
    ];
    protected _extendedCloudItems: IFilterItem[] = [
        textConfig,
        dropdownBasicConfig,
        companyEditorWithoutCaption,
    ];
    protected _mixedItems: IFilterItem[] = [typeEditor, emptyCompanyEditor];
    protected _mixedItemsWithScroll: IFilterItem[] = [
        ...this._basicItems,
        ...[textConfig],
    ];
    protected _mixedCloudItems: IFilterItem[] = [companyEditor, textConfig];
    protected _emptyTextItems: IFilterItem[] = [emptyKeyConfig];
}
