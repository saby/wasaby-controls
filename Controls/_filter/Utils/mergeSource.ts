/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import { object } from 'Types/util';
import isEqualItems from 'Controls/_filter/Utils/isEqualItems';
import { IFilterItem } from 'Controls/filter';

export default function mergeSource(
    target: IFilterItem[] = [],
    source: IFilterItem[] = []
): IFilterItem[] {
    target.forEach((item) => {
        source.forEach((historyItem) => {
            if (isEqualItems(item, historyItem)) {
                for (const fieldName in historyItem) {
                    if (historyItem.hasOwnProperty(fieldName)) {
                        const value = historyItem[fieldName];
                        const allowMerge =
                            fieldName === 'viewMode'
                                ? // Если из истории пришёл viewMode: 'frequent' (быстрый фильтр),
                                  // то его мержить в структуру нельзя,
                                  // потому что viewMode могли поменять и такой фильтр уже не быстрый
                                  value !== undefined &&
                                  ((value !== 'frequent' && item.viewMode !== 'frequent') ||
                                      !item.viewMode)
                                : historyItem.hasOwnProperty(fieldName);

                        if (item.hasOwnProperty(fieldName) && allowMerge) {
                            object.setPropertyValue(item, fieldName, value);
                        } else if (fieldName === 'textValueVisible') {
                            item.textValueVisible = value;
                        }
                    }
                }
            }
        });
    });

    return target;
}
