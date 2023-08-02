/**
 * @kaizen_zone 10186a4a-7303-4e81-9d11-c395e91cec99
 */
import * as React from 'react';
import { IControlProps } from 'Controls/interface';
import formatPhone from './Phone/FormatPhone';
import { IWasabyAttributes } from 'UICore/Executor';
import { getAttrs } from 'Controls/baseDecorator';

export interface IPhoneOptions extends IControlProps {
    /**
     * @name Controls/_extendedDecorator/IPhone#value
     * @cfg {String|null} Декорируемый телефонный номер.
     * @default ''
     * @demo Controls-demo/Decorator/Phone/Index
     */
    value: string | null;
    attrs?: IWasabyAttributes;
}

/**
 * Графический контрол, декорирующий телефонный номер таким образом, что он приводится к заданному формату.
 *
 * @remark
 * Форматы телефонных номеров:
 *
 * * Российские мобильные номера, например +7(XXX) XXX-XX-XX[ доб. {остальные цифры}];
 * * Российские мобильные номера в зависимости от кода города, например +7(XXXX) XX-XX-XX[ доб. {остальные цифры}] или +7(XXXXX) X-XX-XX[ доб. {остальные цифры}];
 * * Иностранные номера, например +{иностранный код} {остальные цифры};
 * * Остальные номера отображаются как есть без формата.
 *
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_decorator.less переменные тем оформления}
 *
 * @class Controls/_extendedDecorator/Phone
 * @implements Controls/interface:IControl
 * @mixes Controls/extendedDecorator:IPhone
 * @public
 * @demo Controls-demo/Decorator/Phone/Index
 *
 */

export default React.memo(function Phone(props: IPhoneOptions): React.ReactElement {
    const formattedPhone: string = formatPhone(props.value !== undefined ? props.value : '');
    const mainClass = 'controls-DecoratorPhone';

    return (
        <span
            ref={props.$wasabyRef}
            title={formattedPhone}
            {...getAttrs(props.attrs, props.className, mainClass)}
        >
            {formattedPhone}
        </span>
    );
});

/**
 * Интерфейс для опций контрола {@link Controls/extendedDecorator:Phone}.
 * @interface Controls/_extendedDecorator/IPhone
 * @public
 */
