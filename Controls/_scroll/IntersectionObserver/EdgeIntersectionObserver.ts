/**
 * @kaizen_zone 7b560386-8131-481a-b9c0-8b3ede6f29a0
 */
import { Control } from 'UI/Base';
import SyntheticEntry from './SyntheticEntry';

export default class EdgeIntersectionObserver {
    private _component: Control;
    private _topTriggerElement: HTMLElement | undefined;
    private _bottomTriggerElement: HTMLElement | undefined;
    private _leftTriggerElement: HTMLElement | undefined;
    private _rightTriggerElement: HTMLElement | undefined;
    private _handler: Function;
    private _id: string | undefined;

    constructor(
        component: Control,
        handler: Function,
        topTriggerElement?: HTMLElement,
        bottomTriggerElement?: HTMLElement,
        leftTriggerElement?: HTMLElement,
        rightTriggerElement?: HTMLElement,
        id?: string
    ) {
        this._component = component;
        this._handler = handler;
        this._id = id;
        this._topTriggerElement = topTriggerElement;
        this._bottomTriggerElement = bottomTriggerElement;
        this._leftTriggerElement = leftTriggerElement;
        this._rightTriggerElement = rightTriggerElement;

        this._observe('top');
        this._observe('bottom');
        this._observe('left');
        this._observe('right');
    }

    private _observe(position: string): void {
        const triggerPropertyName = `_${position}TriggerElement` as keyof EdgeIntersectionObserver;
        if (this[triggerPropertyName]) {
            this._component._notify(
                'intersectionObserverRegister',
                [
                    {
                        instId: this._getInstanceId(position),
                        element: this[triggerPropertyName],
                        threshold: [0, 1],
                        handler: this._observeHandler.bind(this),
                    },
                ],
                { bubbling: true }
            );
        }
    }
    private _unobserve(position: string): void {
        this._component._notify('intersectionObserverUnregister', [this._getInstanceId(position)], {
            bubbling: true,
        });
    }

    protected _observeHandler(item: SyntheticEntry): void {
        // Может отработать после destroy из-за асинхронного кода
        if (!this._handler) {
            return;
        }

        let eventName = '';
        const isBackward =
            item.nativeEntry.target === this._topTriggerElement ||
            item.nativeEntry.target === this._leftTriggerElement;
        eventName += isBackward ? 'top' : 'bottom';
        eventName += item.nativeEntry.isIntersecting ? 'In' : 'Out';

        this._handler(eventName);
    }

    destroy(): void {
        if (this._topTriggerElement) {
            this._unobserve('top');
        }
        if (this._bottomTriggerElement) {
            this._unobserve('bottom');
        }
        if (this._leftTriggerElement) {
            this._unobserve('left');
        }
        if (this._rightTriggerElement) {
            this._unobserve('right');
        }
        this._component = null;
        this._topTriggerElement = null;
        this._bottomTriggerElement = null;
        this._leftTriggerElement = null;
        this._rightTriggerElement = null;
        this._handler = null;
    }

    private _getInstanceId(position: string): string {
        let instanceId = `${this._component.getInstanceId()}-${position}`;
        if (this._id) {
            instanceId += `-${this._id}`;
        }
        return instanceId;
    }
}
