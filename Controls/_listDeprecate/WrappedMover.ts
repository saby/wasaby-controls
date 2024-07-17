/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_listDeprecate/WrappedMover';
import Mover from 'Controls/_listDeprecate/Mover';

export default class WrappedMover extends Control {
    _template: TemplateFunction = template;
    protected _children: {
        mover: Mover;
    };

    moveItemUp(...args: Parameters<Mover['moveItemUp']>): ReturnType<Mover['moveItemUp']> {
        return this._children.mover.moveItemUp(...args);
    }

    moveItemDown(...args: Parameters<Mover['moveItemDown']>): ReturnType<Mover['moveItemDown']> {
        return this._children.mover.moveItemDown(...args);
    }

    moveItems(...args: Parameters<Mover['moveItems']>): ReturnType<Mover['moveItems']> {
        return this._children.mover.moveItems(...args);
    }

    moveItemsWithDialog(
        ...args: Parameters<Mover['moveItemsWithDialog']>
    ): ReturnType<Mover['moveItemsWithDialog']> {
        return this._children.mover.moveItemsWithDialog(...args);
    }

    validate(...args: Parameters<Mover['validate']>): ReturnType<Mover['validate']> {
        return this._children.mover.validate(...args);
    }
}
