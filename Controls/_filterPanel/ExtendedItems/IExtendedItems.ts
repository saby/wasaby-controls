import {IFilterItem} from 'Controls/filter';
import IExtendedPropertyValue from '../_interface/IExtendedPropertyValue';

/**
 * Интерфейс области "Можно отобрать".
 * @public
 * @demo Controls-ListEnv-demo/Filter/View/DetailPanelExtendedTemplateName/Index
 */
export interface IExtendedItems {
    /**
     * Заголовок области "Можно отобрать".
     */
    headingCaption: string;

    /**
     * @cfg {Array.<Controls/filter:IFilterItem>} Устанавливает список полей фильтра и их конфигурацию.
     */
    typeDescription: IFilterItem[];
    /**
     * Объект, свойства которого являются значениями для редакторов фильтра.
     */
    editingObject: Record<string, IExtendedPropertyValue>;
}

/**
 * @event Controls/_filterPanel/IExtendedItems#editingObjectChanged Происходит при изменении объекта, свойства которого являются значениями для редакторов фильтра.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Object | Types/entity:Model} editingObject Объект, с обновленными значениями для редакторов фильтра.
 * @example
 * <pre class="brush: js">
 * // TypeScript
 * _notifyEditingObjectChanged(changedFilterName: string, newValue: string, newTextValue: string) {
 *    // Клонируем editingObject из опций
 *    const newEditingObject = {...this._options.editingObject};
 *
 *    // Записываем новое значение для фильтра, который изменил значение.
 *    newEditingObject[changedFilterName] = {
 *        value: newValue,
 *        textValue: newTextValue,
 *        viewMode: 'basic'
 *    };
 *    this._notify('editingObjectChanged', [newEditingObject]);
 * }
 * </pre>
 * @see editingObject
 */
