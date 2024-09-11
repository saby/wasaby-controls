/**
 * @kaizen_zone 32467cda-e824-424f-9d3b-3faead248ea2
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import ButtonsTemplate = require('wml!Controls/_editableArea/Templates/Buttons');
import { SyntheticEvent } from 'UI/Events';
import 'css!Controls/editableArea';

/**
 * Кнопки для сохранения и отмены редактирования.
 * @extends UI/Base:Control
 * @public
 * @demo Controls-demo/EditableArea/Buttons/Index
 */

class Buttons extends Control<IControlOptions> {
    protected _template: TemplateFunction = ButtonsTemplate;

    constructor(options: unknown) {
        super(options);
        this._onApplyClick = this._onApplyClick.bind(this);
        this._onCloseClick = this._onCloseClick.bind(this);
    }

    protected _afterMount(): void {
        this._notify('registerEditableAreaToolbar', [], { bubbling: true });
    }

    protected _onApplyClick(event: SyntheticEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this._notify('applyButtonClick');
    }

    protected _onCloseClick(event: SyntheticEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this._notify('closeButtonClick');
    }
}
/**
 * @event applyButtonClick Происходит при клике на кнопку сохранения редактирования.
 * @name Controls/_editableArea/Templates/Buttons#applyButtonClick
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 */

/**
 * @event closeButtonClick Происходит при клике на кнопку отмены редактирования.
 * @name Controls/_editableArea/Templates/Buttons#closeButtonClick
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 */
export default Buttons;
