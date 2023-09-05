/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import { object } from 'Types/util';

const getPropValue = object.getPropertyValue;

export default function isEqualItems(item1: object, item2: object): boolean {
    const filter1Name = getPropValue(item1, 'name') || getPropValue(item1, 'id');
    const filter2Name = getPropValue(item2, 'name') || getPropValue(item2, 'id');

    return filter1Name === filter2Name;
}
