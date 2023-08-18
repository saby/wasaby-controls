/**
 * @kaizen_zone 9b624d5d-133f-4f58-8c48-7fb841857d9e
 */
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls/_popupTemplate/Stack/Template/RightPanel/RightPanel';
import { Controller as ManagerController } from 'Controls/popup';
import 'css!Controls/popupTemplate';

interface IRightPanelOptions extends IControlOptions {
    maximizeButtonClickCallback?: () => void;
    toolbarContentTemplate: TemplateFunction;
}

export default class RightPanel extends Control<IRightPanelOptions> {
    protected _template: TemplateFunction = template;
    protected _rightBottomTemplate: string;
    protected _isOutsidePanel: boolean = true;

    protected _beforeMount(options: IRightPanelOptions): void {
        this._getTemplateName = this._getTemplateName.bind(this);
        this._rightBottomTemplate = ManagerController.getRightPanelBottomTemplate();
        if (!ManagerController.hasRightPanel() && options.toolbarContentTemplate) {
            this._isOutsidePanel = false;
        }
    }

    protected _maximizeButtonClickHandler(): void {
        if (this._options.maximizeButtonClickCallback) {
            this._options.maximizeButtonClickCallback();
        }
    }

    protected _close(): void {
        this._notify('close', [], { bubbling: true });
    }

    // Для пользователей делается механизм подсказок, который должен быть привязан к определенному шаблону на
    // сайте. На уровне StackTemplate мы не знаем в каком шаблоне находимся и не можем передать это в контроллер
    // подсказок. Передадим метод, который по DOM определит имя шаблона. Другого способа узнать имя шаблона окна пока
    // нет, оставим поддержку полукостыля на нашем уровне.
    protected _getTemplateName(): string {
        const popupContainer = this._container.closest('.controls-Popup');
        return popupContainer ? popupContainer.getAttribute('templateName') : '';
    }
}
