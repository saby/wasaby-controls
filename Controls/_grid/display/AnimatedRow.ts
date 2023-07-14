/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import DataRow from './DataRow';

/**
 * Анимированный элемент коллекции
 * @extends Controls/_grid/display/Row
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
