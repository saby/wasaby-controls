/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import { isEqual } from 'Types/object';
import { IFilterItem } from 'Controls/filter';
import { Logger } from 'UI/Utils';

export default function isFilterItemChanged(filterItem: IFilterItem): boolean {
    const { name, value, resetValue, visibility, editorTemplateName } = filterItem;
    const isValueChanged = value !== undefined && !isEqual(value, resetValue);
    const isFilterVisible = visibility === undefined || visibility === true;

    if (isValueChanged && !isFilterVisible && !editorTemplateName) {
        Logger.error(
            `Для элемента фильтра ${name} установлено visibility: false при изменённом значении опции value (value !== resetValue).`
        );
    }

    return isValueChanged && isFilterVisible;
}
