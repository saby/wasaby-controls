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

    if (!args.value) {
        return true;
    }
    const phoneNumber = args.value;
    let isMobile = false;

    // Удаляем все нецифровые символы, кроме возможного '+' в начале
    const cleaned = phoneNumber.replace(/(?!^\+)\D/g, '');

    if (cleaned.startsWith('+7')) {
        isMobile =
            cleaned?.indexOf('+79') === 0 ||
            cleaned?.indexOf('+77') === 0 ||
            cleaned?.indexOf('+76') === 0;
    } else if (cleaned.startsWith('+')) {
        // Минимальная длина международного номера с кодом страны, но без префикса оператора
        isMobile = cleaned.length >= 8 && cleaned.length <= 15;
    } else if (/^\d+$/.test(cleaned)) {
        // Проверяем номер без кода страны (только цифры)
        // Для России обычно 10 цифр (без +7 или 8)
        isMobile =
            (cleaned.length === 10 && (cleaned.startsWith('9') || cleaned.startsWith('8'))) ||
            (cleaned.length === 11 && cleaned.startsWith('8'));
    }

    return isMobile ? true : rk('Некорректный номер телефона. Введите мобильный номер телефона.');
}

export default validate;
