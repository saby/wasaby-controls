/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
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
