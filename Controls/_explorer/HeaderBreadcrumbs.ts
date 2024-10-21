/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { Model } from 'Types/entity';
import { SyntheticEvent } from 'UICommon/Events';
import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_explorer/HeaderBreadcrumbs';

/**
 * Компонент с крошками и кнопкой "Назад", который встраивается в первую ячейку заголовка таблицы
 * @private
 */
export default class HeaderBreadcrumbs extends Control {
    protected _template: TemplateFunction = template;

    protected _onArrowClick(event: SyntheticEvent): void {
        this._notify('headerArrowClick', [], { bubbling: true });
    }

    protected _onArrowActivated(event: SyntheticEvent): void {
        this._notify('headerArrowActivated', [], { bubbling: true });
    }

    protected _onItemClick(event: SyntheticEvent, item: Model): void {
        this._notify('headerBreadcrumbsClick', [item], { bubbling: true });
    }

    protected _hoveredCrumbChanged(event: SyntheticEvent, item: Model): void {
        this._notify('hoveredItemChanged', [item], { bubbling: true });
    }
}
