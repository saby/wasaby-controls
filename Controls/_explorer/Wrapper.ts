/**
 * @kaizen_zone e8e36b1a-d1b2-42b9-a236-b49c3be0934f
 */
import { TemplateFunction, IControlOptions, Control } from 'UI/Base';
import Explorer from 'Controls/_explorer/View';
import * as template from 'wml!Controls/_explorer/Wrapper';
import type { IAbstractColumnScrollControl } from 'Controls/gridColumnScroll';

type FnParams<T extends keyof Explorer> = Parameters<Explorer[T]>;
type FnResult<T extends keyof Explorer> = ReturnType<Explorer[T]>;

export default class ExplorerWrapper extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _children: {
        explorer: Explorer;
    };

    getMarkedNodeKey(...args: FnParams<'getMarkedNodeKey'>): FnResult<'getMarkedNodeKey'> {
        return this._children.explorer.getMarkedNodeKey(...args);
    }

    removeItems(...args: FnParams<'removeItems'>): FnResult<'removeItems'> {
        return this._children.explorer.removeItems(...args);
    }

    removeItemsWithConfirmation(
        ...args: FnParams<'removeItemsWithConfirmation'>
    ): FnResult<'removeItemsWithConfirmation'> {
        return this._children.explorer.removeItemsWithConfirmation(...args);
    }

    moveItems(...args: FnParams<'moveItems'>): FnResult<'moveItems'> {
        return this._children.explorer.moveItems(...args);
    }

    moveItemUp(...args: FnParams<'moveItemUp'>): FnResult<'moveItemUp'> {
        return this._children.explorer.moveItemUp(...args);
    }

    moveItemDown(...args: FnParams<'moveItemDown'>): FnResult<'moveItemDown'> {
        return this._children.explorer.moveItemDown(...args);
    }

    moveItemsWithDialog(...args: FnParams<'moveItemsWithDialog'>): FnResult<'moveItemsWithDialog'> {
        return this._children.explorer.moveItemsWithDialog(...args);
    }

    toggleExpanded(...args: FnParams<'toggleExpanded'>): FnResult<'toggleExpanded'> {
        return this._children.explorer.toggleExpanded(...args);
    }

    getItems(...args: FnParams<'getItems'>): FnResult<'getItems'> {
        return this._children.explorer.getItems(...args);
    }

    scrollTo(...args: FnParams<'scrollTo'>): FnResult<'scrollTo'> {
        return this._children.explorer.scrollTo(...args);
    }

    scrollToItem(...args: FnParams<'scrollToItem'>): FnResult<'scrollToItem'> {
        return this._children.explorer.scrollToItem(...args);
    }

    reloadItem(...args: FnParams<'reloadItem'>): FnResult<'reloadItem'> {
        return this._children.explorer.reloadItem(...args);
    }

    reloadItems(...args: FnParams<'reloadItems'>): FnResult<'reloadItems'> {
        return this._children.explorer.reloadItems(...args);
    }

    horizontalScrollTo(
        ...args: Parameters<IAbstractColumnScrollControl['horizontalScrollTo']>
    ): ReturnType<IAbstractColumnScrollControl['horizontalScrollTo']> {
        return this._children.explorer.horizontalScrollTo(...args);
    }

    scrollToLeft(...args: FnParams<'scrollToLeft'>): FnResult<'scrollToLeft'> {
        return this._children.explorer.scrollToLeft(...args);
    }

    scrollToRight(...args: FnParams<'scrollToRight'>): FnResult<'scrollToRight'> {
        return this._children.explorer.scrollToRight(...args);
    }

    scrollToColumn(...args: FnParams<'scrollToColumn'>): FnResult<'scrollToColumn'> {
        return this._children.explorer.scrollToColumn(...args);
    }

    beginEdit(...args: FnParams<'beginEdit'>): FnResult<'beginEdit'> {
        return this._children.explorer.beginEdit(...args);
    }

    beginAdd(...args: FnParams<'beginAdd'>): FnResult<'beginAdd'> {
        return this._children.explorer.beginAdd(...args);
    }

    cancelEdit(...args: FnParams<'cancelEdit'>): FnResult<'cancelEdit'> {
        return this._children.explorer.cancelEdit(...args);
    }

    commitEdit(...args: FnParams<'commitEdit'>): FnResult<'commitEdit'> {
        return this._children.explorer.commitEdit(...args);
    }

    reload(...args: FnParams<'reload'>): FnResult<'reload'> {
        return this._children.explorer.reload(...args);
    }
}
