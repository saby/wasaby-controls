/**
 * @kaizen_zone ddbc0bdc-0710-4e01-9472-8d1982a63a4e
 */
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import template = require('wml!Controls/_actions/SortingActions/MenuItemTemplate');
import { SyntheticEvent } from 'UI/Vdom';
import { Record } from 'Types/entity';
import { TSortingValue } from 'Controls/interface';
import 'css!Controls/sorting';

export default class MenuItemTemplate extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    protected _arrowClick(e: SyntheticEvent<Event>, item: Record): void {
        const newValue = MenuItemTemplate._getOppositeOrder(item.get('value') || 'ASC');
        item.set('value', newValue);
    }

    protected static _getOppositeOrder = (order: TSortingValue) => {
        if (order === 'DESC' || !order) {
            return 'ASC';
        }
        return 'DESC';
    };
}
