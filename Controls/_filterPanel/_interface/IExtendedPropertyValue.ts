/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { IFilterItem } from 'Controls/filter';

/**
 * Интерфейс редактора, располагающегося в области "Можно отобрать" панели фильтров.
 * @private
 */
export default interface IExtendedPropertyValue {
    /**
     * Текущее значение фильтра
     */
    value: unknown;
    /**
     * Текстовое представление фильтра
     */
    textValue: string;
    /**
     * Режим отображения фильтра {@link Controls/filter:IFilterItem#viewMode}
     */
    viewMode?: IFilterItem['viewMode'];
}
