/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import DataRow from './DataRow';

/**
 * Анимированный элемент коллекции
 * @extends Controls/_baseGrid/display/Row
 * @public
 */
export default class AnimatedRow extends DataRow {
    readonly EditableItem: boolean = false;
    readonly '[Controls/_display/AnimatedRow]': true;

    get key(): string {
        const baseKey = this._$contents.get(this.getKeyProperty());
        return baseKey + this.getAnimation();
    }
}

Object.assign(AnimatedRow.prototype, {
    '[Controls/_display/AnimatedRow]': true,
    _moduleName: 'Controls/grid:AnimatedRow',
    _instancePrefix: 'animated-item-',
    _$multiSelectVisibility: null,
});
