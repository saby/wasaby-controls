import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/filterPanelPopup/Sticky/Index';
import { IFilterItem } from 'Controls/filter';
import { RecordSet } from 'Types/collection';
import { tumblerConfig } from 'Controls-demo/filterPanelPopup/Editors/Tumbler/Index';
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
} from 'Controls-demo/filterPanelPopup/Sticky/resources/Data';
import 'Controls-demo/filterPanelPopup/Sticky/resources/HistorySourceDemo';

const chipsEditor = {
    caption: 'Пол',
    name: 'genderChips',
    value: '1',
    resetValue: '1',
    textValue: '',
    viewMode: 'basic',
    editorTemplateName: 'Controls/propertyGrid:ChipsEditor',
    editorOptions: {
        items: new RecordSet({
            rawData: [
                {
                    id: '1',
                    caption: 'Мужской',
                },
                {
                    id: '2',
                    caption: 'Женский',
                },
            ],
            keyProperty: 'id',
        }),
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
        this._mixedItems = [
            ...this._simpleBasicItems,
            ...this._simpleExtendedItems,
        ];
        this._mixedScrollItems = [
            ...[radioGroupConfig, tumblerConfig, numberRangeBasicConfig],
            ...this._extendedItems,
        ];
    }
}
