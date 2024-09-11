import { RecordSet } from 'Types/collection';
import { getSearchResolver } from 'Controls/_dataFactory/AbstractList/utils/getSearchResolver';

export function getSearchMisspellValue(items: RecordSet): string {
    return getSearchResolver().getSwitcherStrFromData(items);
}
