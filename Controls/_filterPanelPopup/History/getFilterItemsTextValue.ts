import { isEqual } from 'Types/object';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { IFilterItem } from 'Controls/filter';

export default function getFilterItemsTextValue(
    historyItems: IFilterItem[],
    filterDescription: IFilterItem[]
): string {
    const textArr: string[] = [];

    historyItems.forEach((elem) => {
        const sourceItem = filterDescription.find(({ name }) => name === elem.name);
        const value = elem.value;
        let textValue = elem.textValue;

        if (sourceItem && !isEqual(value, sourceItem.resetValue) && textValue) {
            if (
                sourceItem.editorTemplateName === 'Controls/filterPanelEditors:DateMenu' &&
                !sourceItem.editorOptions?.dateMenuItems &&
                !sourceItem.editorOptions?.items
            ) {
                const getTextValue = loadSync<
                    typeof import('Controls/filterPanelEditors').GetDateMenuTextValue
                >('Controls/filterPanelEditors:GetDateMenuTextValue');
                textValue =
                    getTextValue(sourceItem.editorOptions, null, elem.value) || elem.textValue;
            }

            if (sourceItem.historyCaption) {
                textValue = `${sourceItem.historyCaption}: ${textValue}`;
            }
            textArr.push(textValue);
        }
    });

    return textArr.join(', ');
}
