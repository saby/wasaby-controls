/**
 * @kaizen_zone f30239e7-9eed-4273-bd85-3f5d432228f8
 */
import * as rk from 'i18n!Controls';

interface IArgs {
    value: string;
    doNotValidate: boolean;
}

/**
 * Функция проверяет корректность введенного мобильного номера телефона.
 * @class Controls/_validate/Validators/IsPhoneMobile
 * @public
 * @remark
 * Подробнее о работе с валидацией читайте {@link /doc/platform/developmentapl/interface-development/forms-and-validation/validation/ здесь}.
 *
 * Аргументы функции:
 *
 * * value — проверяемое значение.
 * * doNotValidate:Boolean — требуется ли валидация.
 *
 * Типы возвращаемых значений:
 *
 * * true — значение прошло проверку на валидность.
 * * string — значение не прошло проверку на валидность, возвращается текст сообщения об ошибке.
 *
 * @example
 * <pre>
 * <Controls.validate:InputContainer name="InputValidate">
 *     <ws:validators>
 *         <ws:Function value="{{_valueIsRequired}}">Controls/validate:isPhoneMobile</ws:Function>
 *      </ws:validators>
 *      <ws:content>
 *         <Controls.input:Phone onlyMobile="{{true}}" bind:value="_valueIsRequired"/>
 *      </ws:content>
 * </Controls.validate:InputContainer>
 * </pre>
 */
function validate(args: IArgs): boolean | string {
    // Если передали в аргументах doNotValidate, значит возвращаем true
    // (параметр нужен для опционального включения/отключения валидатора)
    if (args.doNotValidate) {
        return true;
    }

    const isMobile = args.value?.indexOf('+79') === 0;

    return isMobile ? true : rk('Некорректный номер телефона. Введите мобильный номер телефона.');
}

export default validate;
