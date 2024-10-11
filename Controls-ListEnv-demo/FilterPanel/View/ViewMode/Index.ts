import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/FilterPanel/View/ViewMode/Index';
import { IFilterItem } from 'Controls/filter';
import { Memory } from 'Types/source';
import { markerListConfig } from 'Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/MarkerStyle/Index';
import { emptyKeyConfig } from 'Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/EmptyKey/Index';
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
    companyEditorWithCount,
} from 'Controls-ListEnv-demo/FilterPanelPopup/Sticky/resources/Data';

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
    ].map((filterItem) => {
        return {
            ...filterItem,
            extendedCaption: null,
            editorOptions: {
                ...filterItem.editorOptions,
                extendedCaption: null,
            },
        };
    });
    protected _extendedItems: IFilterItem[] = [typeEditor, extendedCompanyEditor];
    protected _extendedCloudItems: IFilterItem[] = [
        textConfig,
        dropdownBasicConfig,
        companyEditorWithoutCaption,
    ];
    protected _mixedItems: IFilterItem[] = [typeEditor, emptyCompanyEditor];
    protected _mixedItemsWithScroll: IFilterItem[] = [...this._basicItems, ...[textConfig]];
    protected _mixedCloudItems: IFilterItem[] = [companyEditor, textConfig];
    protected _emptyTextItems: IFilterItem[] = [emptyKeyConfig, companyEditorWithCount];
}
