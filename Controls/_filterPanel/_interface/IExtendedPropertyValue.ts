/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { IFilterItem } from 'Controls/filter';

/**
 * Интерфейс редактора, располагающегося в области "Можно отобрать" панели фильтров.
 * @interface Controls/_filterPanel/_interface/IExtendedPropertyValue
 * @public
 */
export default interface IExtendedPropertyValue {
    value: unknown;
    textValue: string;
    viewMode?: IFilterItem['viewMode'];
}
