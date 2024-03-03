/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import {
    AbstractObserversController,
    IAbstractObserversControllerOptions,
    TIntersectionEvent,
    IDirectionNew as IDirection,
} from 'Controls/baseList';
import { EdgeIntersectionObserver } from 'Controls/scroll';
import { Control } from 'UI/Base';

export { IAbstractObserversControllerOptions as IObserversControllerOptions };

export class ObserversController extends AbstractObserversController {
    protected _createTriggersObserver(
        component: Control,
        handler: Function,
        backwardTriggerElement?: HTMLElement,
        forwardTriggerElement?: HTMLElement
    ): EdgeIntersectionObserver {
        return new EdgeIntersectionObserver(
            component,
            (eventName: TIntersectionEvent) => {
                handler(eventName);
            },
            undefined,
            undefined,
            backwardTriggerElement,
            forwardTriggerElement
        );
    }

    protected _applyTriggerOffset(
        element: HTMLElement,
        direction: IDirection,
        offset: number
    ): void {
        if (this._triggersOffsetMode === 'inset') {
            if (direction === 'backward') {
                element.style.left = `${offset}px`;
            } else {
                element.style.right = `${offset}px`;
            }
        } else {
            if (direction === 'backward') {
                element.style.transform = `translateX(${offset}px)`;
            } else {
                element.style.transform = `translateX(-${offset}px)`;
            }
        }
    }
}
