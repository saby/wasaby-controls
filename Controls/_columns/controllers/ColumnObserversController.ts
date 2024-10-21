import { AbstractObserversController, IDirectionNew, TIntersectionEvent } from 'Controls/baseList';
import { EdgeIntersectionObserver } from 'Controls/scroll';
import { Control } from 'UI/Base';
import { COLUMN_SELECTOR } from '../Constants';

/**
 * Класс предназначен для управления observer, срабатывающим при достижении границ контента списка.
 * Используется при работе с вертикальным скроллом
 * @private
 */
export class ColumnObserversController extends AbstractObserversController {
    protected _createTriggersObserver(
        component: Control,
        handler: Function,
        backwardTriggerElement?: HTMLElement,
        forwardTriggerElement?: HTMLElement
    ): EdgeIntersectionObserver {
        const columnElement =
            backwardTriggerElement.closest(COLUMN_SELECTOR) ||
            forwardTriggerElement.closest(COLUMN_SELECTOR);
        const columnId = columnElement.getAttribute('item-key');
        return new EdgeIntersectionObserver(
            component,
            (eventName: TIntersectionEvent) => {
                handler(eventName);
            },
            backwardTriggerElement,
            forwardTriggerElement,
            undefined,
            undefined,
            columnId
        );
    }

    protected _applyTriggerOffset(
        element: HTMLElement,
        direction: IDirectionNew,
        offset: number
    ): void {
        if (direction === 'backward') {
            element.style.transform = `translateY(${offset}px)`;
        } else {
            element.style.transform = `translateY(-${offset}px)`;
        }
    }

    protected _getTriggers(): HTMLElement[] {
        const triggers = super._getTriggers();
        // триггеров может не быть, например при пустом отображении
        if (triggers.length) {
            triggers[0].style.position = 'relative';
            triggers[1].style.position = 'relative';
        }
        return triggers;
    }

    protected _getTriggerPosition(
        direction: IDirectionNew,
        _contentSizeBeforeList: number
    ): number {
        if (!this._listContainer || !this._triggers?.length) {
            return 0;
        }

        const listContainerTop = this._listContainer.getBoundingClientRect().top;
        const trigger = direction === 'backward' ? this._triggers[0] : this._triggers[1];
        return trigger.getBoundingClientRect().top - listContainerTop;
    }
}
