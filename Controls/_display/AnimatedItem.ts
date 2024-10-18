/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import CollectionItem from './CollectionItem';

/**
 * Анимированный элемент коллекции
 * @extends Controls/_display/CollectionItem
 * @public
 */
export default class AnimatedItem extends CollectionItem {
    readonly EditableItem: boolean = false;
    readonly '[Controls/_display/AnimatedItem]': true;

    get key(): string {
        const baseKey = this._$contents.get(this.getKeyProperty());
        return baseKey + this.getAnimation();
    }
}

Object.assign(AnimatedItem.prototype, {
    '[Controls/_display/AnimatedItem]': true,
    _moduleName: 'Controls/display:AnimatedItem',
    _instancePrefix: 'animated-item-',
    _$multiSelectVisibility: null,
});
