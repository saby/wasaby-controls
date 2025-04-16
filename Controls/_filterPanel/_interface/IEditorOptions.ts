/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { IEditor } from 'Controls/propertyGridEditors';
import { TEditorsViewMode } from 'Controls/_filterPanel/View/ViewModel';
import { IFilterDescriptionItem } from 'Controls-DataEnv/interface';

/**
 * Интерфейс редактора панели фильтров.
 * @private
 */
export default interface IEditorOptions<T> extends IEditor<T> {
    onPropertyValueChanged: (propertyValue: T) => void;
    extendedCaption?: string;
    viewMode: IFilterDescriptionItem['viewMode'];
    resetValue?: unknown;
    filterViewMode: 'popup' | 'default';
    editorsViewMode: TEditorsViewMode;
}
