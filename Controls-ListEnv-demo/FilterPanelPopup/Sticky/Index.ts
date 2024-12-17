import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/FilterPanelPopup/Sticky/Index';
import { IFilterItem } from 'Controls/filter';
import {
    textConfig,
    textBasicConfig,
    radioGroupConfig,
    numberRangeConfig,
    numberRangeBasicConfig,
    typeEditor,
    dropdownMultiSelectConfig,
    dropdownMultiSelectBasicConfig,
    dateConfig,
    dateBasicConfig,
    dateMenuConfig,
    dateMenuBasicConfig,
    dateRangeConfig,
    dateRangeBasicConfig,
    dropdownConfig,
    dropdownBasicConfig,
    textConfigOwner,
    extendedCompanyEditor,
    multiSelectLookupConfig,
    multiSelectLookupBasicConfig,
    lookupBasicConfig,
    lookupConfig,
    textConfigWithLongCaption,
    inputConfig,
    inputLookupConfig,
    dropdownFrequentItemConfig,
    dropdownAllFrequentConfig,
    tumblerConfig,
    lookupBasicConfigWithEmptyText,
} from 'Controls-ListEnv-demo/FilterPanelPopup/Sticky/resources/Data';
import { ChipsConfig } from 'Controls-ListEnv-demo/Filter/View/Editors/ChipsEditor/Index';
import 'Controls-ListEnv-demo/FilterPanelPopup/Sticky/resources/HistorySourceDemo';

const chipsEditor = {
    ...ChipsConfig,
    ...{
        name: 'genderChips',
    },
} as IFilterItem;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _basicItems: IFilterItem[] = [];
    protected _simpleBasicItems: IFilterItem[] = [];
    protected _extendedItems: IFilterItem[] = [];
    protected _simpleExtendedItems: IFilterItem[] = [];
    protected _mixedItems: IFilterItem[] = [];
    protected _mixedScrollItems: IFilterItem[] = [];

    protected _beforeMount(): void {
        const multiSelectLookup = { ...multiSelectLookupConfig };
        multiSelectLookup.name = 'multipleLookup';
        this._basicItems = [
            lookupBasicConfigWithEmptyText,
            radioGroupConfig,
            tumblerConfig,
            chipsEditor,
            textBasicConfig,
            numberRangeBasicConfig,
            dropdownMultiSelectBasicConfig,
            dateMenuBasicConfig,
            dateBasicConfig,
            dateRangeBasicConfig,
            dropdownBasicConfig,
            multiSelectLookupBasicConfig,
            lookupBasicConfig,
            inputConfig,
            inputLookupConfig,
        ];
        this._simpleBasicItems = [dropdownBasicConfig];
        this._extendedItems = [
            dropdownConfig,
            textConfig,
            textConfigWithLongCaption,
            numberRangeConfig,
            dropdownFrequentItemConfig,
            dropdownAllFrequentConfig,
            dropdownMultiSelectConfig,
            textConfigOwner,
            multiSelectLookup,
            lookupConfig,
            dateConfig,
            dateMenuConfig,
            dateRangeConfig,
            typeEditor,
            extendedCompanyEditor,
        ];
        this._simpleExtendedItems = [textConfig];
        this._mixedItems = [...this._simpleExtendedItems, ...this._simpleBasicItems];
        this._mixedScrollItems = [
            ...[radioGroupConfig, tumblerConfig, numberRangeBasicConfig],
            ...this._extendedItems,
        ];
    }
}
