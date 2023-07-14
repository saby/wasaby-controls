/**
 * @kaizen_zone 98d4b42e-2c0e-4268-a9e8-1e54d6e8ef27
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_masterDetail/List/List';
import { SyntheticEvent } from 'Vdom/Vdom';

/**
 * Контрол используют в качестве контейнера для списочного контрола, который добавлен в шаблон {@link Controls/masterDetail:Base#master master}.
 * Он обеспечивает передачу текущей отмеченной записи в списке между списком и master'ом через всплывающее событие selectedMasterValueChanged.
 * @extends UI/Base:Control
 * @public
 * @demo Controls-demo/MasterDetail/Demo
 */

export default class List extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    protected _markedKeyChangedHandler(event: SyntheticEvent<Event>, key: string): void {
        this._notify('selectedMasterValueChanged', [key], { bubbling: true });
    }
}

/**
 * @name Controls/_masterDetail/List#markedKey
 * @cfg {Types/source:ICrud#CrudEntityKey} Ключ выбранного элемента в мастере
 */

/**
 * @name Controls/_masterDetail/List#selectedMasterValueChanged
 * @event Происходит при смене выбранной записи.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Number} key Ключ выбранного элемента.
 */
