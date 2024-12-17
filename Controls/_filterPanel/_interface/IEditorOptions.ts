/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { IEditor } from 'Controls/propertyGridEditors';

/**
 * Интерфейс редактора панели фильтров.
 * @private
 */
export default interface IEditorOptions<T> extends IEditor<T> {
    onPropertyValueChanged?: Function;
    extendedCaption?: string;
    viewMode: string;
    resetValue?: unknown;
}
