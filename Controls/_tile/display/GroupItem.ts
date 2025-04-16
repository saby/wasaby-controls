/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
 */
import { GroupItem as BaseGroupItem } from 'Controls/display';

/**
 * Элемент коллекции "Группа" для плитки
 * @extends Controls/_display/GroupItem
 * @private
 */
export default class GroupItem<T> extends BaseGroupItem<T> {
    getGroupPaddingClasses(side: 'left' | 'right'): string {
        if (side === 'left') {
            const spacing = this.getOwner().getLeftPadding().toLowerCase();
            return `controls-TileView__item_spacingLeft_${spacing}`;
        } else {
            const spacing = this.getOwner().getRightPadding().toLowerCase();
            return `controls-TileView__item_spacingRight_${spacing}`;
        }
    }
}

Object.assign(GroupItem.prototype, {
    '[Controls/_tile/display/GroupItem]': true,
    _moduleName: 'Controls/tile:GroupItem',
    _instancePrefix: 'group-item-',
    _$multiSelectVisibility: null,
});
