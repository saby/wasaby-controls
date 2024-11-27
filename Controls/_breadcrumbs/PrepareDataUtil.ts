/**
 * @kaizen_zone 5027e156-2300-4ab3-8a3a-d927588bb443
 */
import { Record } from 'Types/entity';

export interface IVisibleItem {
    item: Record;
    isDots?: boolean;
    hasArrow: boolean;
    withOverflow: boolean;
}

export default {
    getItemData(
        index: number,
        items: Record[],
        arrow: boolean = false,
        withOverflow: boolean = false
    ): IVisibleItem {
        const currentItem = items[index];
        const count = items.length;
        return {
            item: currentItem,
            hasArrow: (count > 1 && index !== 0) || arrow,
            withOverflow,
        };
    },
    drawBreadCrumbsItems(items: Record[], arrow: boolean = false): IVisibleItem[] {
        return items.map((item, index, array) => {
            return this.getItemData(index, array, arrow);
        });
    },
};
