/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_listDeprecate/WrappedRemover';
import Remover from 'Controls/_listDeprecate/Remover';

export default class WrappedRemover extends Control {
    _template: TemplateFunction = template;
    protected _children: {
        remover: Remover;
    };

    removeItems(...args: Parameters<Remover['removeItems']>): ReturnType<Remover['removeItems']> {
        return this._children.remover.removeItems(...args);
    }
}
