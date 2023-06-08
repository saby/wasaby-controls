/**
 * @kaizen_zone 8e9f958c-e7b9-46ba-b23a-5ab1a7dfda6f
 */
import { default as Money } from 'Controls/_input/Money';
import { IBaseInputOptions } from 'Controls/_input/Base';
import { detection } from 'Env/Env';
import fieldTemplate = require('wml!Controls/_input/Money/Field');

/**
 * Поле ввода денежных значений. Отличается от {@link Controls/input:Money} другим отображением копеек.
 *
 * @remark
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2FExample%2FInput демо-пример}
 * * {@link /doc/platform/developmentapl/interface-development/controls/input-elements/input/money/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_input.less переменные тем оформления}
 *
 * @class Controls/_input/MoneyNew
 * @extends Controls/input:Money
 *
 * @public
 * @demo Controls-demo/Input/MoneyNew/Base/Index
 *
 */
class MoneyNew extends Money {
    protected _inputMode: string = 'decimal';
    protected _controlName: string = 'MoneyNew';

    protected _initProperties(options: IBaseInputOptions): void {
        super._initProperties(options);
        if (!detection.isIE) {
            this._field.template = fieldTemplate;
            this._field.scope = {
                ...this._field.scope,
                ...{
                    fontWeight: options.fontWeight,
                    fontSize: options.fontSize,
                    fontColorStyle: options.fontColorStyle,
                },
            };
        }
    }
}

export default MoneyNew;
