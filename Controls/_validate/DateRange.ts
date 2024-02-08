/**
 * @kaizen_zone f30239e7-9eed-4273-bd85-3f5d432228f8
 */
import Container from 'Controls/_validate/Container';
import { TemplateFunction } from 'UI/Base';
import template = require('wml!Controls/_validate/DateRange');

/**
 * Контрол, регулирующий валидацию своего контента. Используется с контролами, поддерживающими интерфейс {@link Controls/_dateRamge/IDateRange IDateRange}.
 * Валидация запускается автоматически как при потере фокуса, так и при изменении значения.
 * @remark
 * Подробнее о работе с валидацией читайте {@link /doc/platform/developmentapl/interface-development/forms-and-validation/validation/ здесь}.
 * @extends Controls/_validate/Container
 *
 * @public
 */

class DateRange extends Container {
    _template: TemplateFunction = template;

    _rangeChangedHandler(): void {
        if (!this._options.readOnly) {
            this._shouldValidate = true;
            this._forceUpdate();
        }
    }

    protected _afterUpdate(oldOptions): void {
        if (this._shouldValidate || this._options.value !== oldOptions.value) {
            this._shouldValidate = false;
            this.validate();
        }
    }
}

export default DateRange;
