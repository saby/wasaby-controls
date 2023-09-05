import { AbstractObserversController } from 'Controls/baseList';
import { IDirection } from 'Controls/_baseList/Controllers/ScrollController/ScrollController';
import EdgeIntersectionObserver from 'Controls/_scroll/IntersectionObserver/EdgeIntersectionObserver';
import { Control } from 'UI/Base';

export class TestIntersectionObserver extends EdgeIntersectionObserver {}

interface IDirectionParams {
    element: HTMLElement;
    offset: number;
}

interface ITriggerParams {
    backward: IDirectionParams;
    forward: IDirectionParams;
}

export class TestObserverController extends AbstractObserversController {
    private _triggerOffsetParams: ITriggerParams;

    getTriggersObserver(): TestIntersectionObserver {
        return this._observer;
    }

    getTriggerOffsetParams(): ITriggerParams {
        return this._triggerOffsetParams;
    }

    protected _applyTriggerOffset(
        element: HTMLElement,
        direction: IDirection,
        offset: number
    ): void {
        if (!this._triggerOffsetParams) {
            this._triggerOffsetParams = {
                backward: { element: null, offset: null },
                forward: { element: null, offset: null },
            };
        }
        this._triggerOffsetParams[direction] = { element, offset };
    }

    protected _createTriggersObserver(
        component: Control,
        handler: Function,
        backwardTriggerElement?: HTMLElement,
        forwardTriggerElement?: HTMLElement
    ): EdgeIntersectionObserver {
        return new TestIntersectionObserver(
            component,
            handler,
            backwardTriggerElement,
            forwardTriggerElement
        );
    }
}
