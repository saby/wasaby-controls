/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
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
