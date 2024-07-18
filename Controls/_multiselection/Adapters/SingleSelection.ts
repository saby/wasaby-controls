/**
 * @kaizen_zone b3b3d041-8fb2-4abe-a87a-caade6edf0de
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_multiselection/Adapters/SingleSelection';
import { SyntheticEvent } from 'Vdom/Vdom';

/**
 * Контейнер для работы со списочными контролами, который отслеживает изменение выбранного элемента и уведомляет с помощью события «selectedKeyChanged».
 * @class Controls/_multiselection/Adapters/SingleSelection
 * @extends Core/Control
 * @public
 *
 */

/**
 * @name Controls/_multiselection/Adapters/SingleSelection#selectedKeyChanged
 * @event Происходит при изменении выбранного значения в списке.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {number|string} selectedKey Ключ выбранного элемента.
 */

class SingleSelection extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    protected _handleSelectedKeysChanged(
        event: SyntheticEvent,
        keys: number[] | string[],
        added?: number[] | string[],
        deleted?: number[] | string[]
    ): void {
        event.stopPropagation();
        let selectedKey;
        if (!added && !deleted) {
            selectedKey = keys.length ? keys[0] : null;
        } else {
            selectedKey = added.length ? added[0] : deleted[0];
        }
        this._notify('selectedKeyChanged', [selectedKey], { bubbling: true });
    }
}
export default SingleSelection;
