/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { IEditor } from 'Controls/propertyGrid';
import { IControlOptions } from 'UI/Base';

/**
 * Интерфейс редактора панели фильтров.
 * @private
 */
export default interface IEditorOptions<T> extends IEditor<T>, IControlOptions {
    onPropertyValueChanged?: Function;
    extendedCaption?: string;
    viewMode: string;
    resetValue?: unknown;
}
