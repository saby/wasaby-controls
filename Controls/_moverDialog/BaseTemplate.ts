/**
 * @kaizen_zone 1ae44c37-18d9-4109-b22c-bd35470364aa
 */
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import rk = require('i18n!Controls');
import { DOMUtil, ResizeObserverUtil } from 'Controls/sizeUtils';

import template = require('wml!Controls/_moverDialog/BaseTemplate/BaseTemplate');
import 'css!Controls/moverDialog';

// Без указания темы ширина тут всегда будет 0
const MOVE_DIALOG_MEASURER_CLASS_TEMPLATE =
    'controls_popupTemplate_theme-default controls-MoveDialog';

interface IOptions extends IControlOptions {
    headingCaption: string;
}

/**
 * Базовый шаблон диалогового окна, используемый в списках при перемещении элементов для выбора целевой папки.
 *
 * @remark
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_moveDialog.less переменные тем оформления}
 *
 *
 * @public
 * @class Controls/_moverDialog/BaseTemplate
 */
export default class BaseTemplate extends Control<IOptions> {
    _template: TemplateFunction = template;
    _headingCaption: string;

    // Опция для проброса в Breadcrumbs. Позволяет правильно расчитать размеры Breadcrumbs
    _containerWidth: number;

    private _resizeObserver: ResizeObserverUtil;

    protected _beforeMount(
        options?: IOptions,
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._headingCaption = options.headingCaption || rk('Куда переместить');
    }

    protected _afterMount(): void {
        this._containerWidth = this._calculateWidth();
        this._resizeObserver = new ResizeObserverUtil(
            this,
            this._resizeObserverCallback.bind(this)
        );
        this._resizeObserver.observe(this._container);
    }

    private _resizeObserverCallback(entry: { contentRect: { width: number } }[]): void {
        const width = entry[0].contentRect.width;
        if (width !== this._containerWidth) {
            this._containerWidth = width;
        }
    }

    protected _calculateWidth(): number {
        return DOMUtil.getWidthForCssClass(MOVE_DIALOG_MEASURER_CLASS_TEMPLATE);
    }
}

/**
 * @name Controls/_moverDialog/BaseTemplate#headingCaption
 * @cfg {String} Заголовок окна перемещения.
 * @default 'Куда переместить'
 */

/**
 * @name Controls/_moverDialog/BaseTemplate#headerContentTemplate
 * @cfg {function|String} Контент, располагающийся между заголовком и крестиком закрытия.
 */

/**
 * @name Controls/_moverDialog/BaseTemplate#bodyContentTemplate
 * @cfg {function|String} Основной контент шаблона, располагается под headerContentTemplate.
 */
