/**
 * @kaizen_zone 3f785aa8-d36c-4b57-946a-a916e51ded4d
 */
import * as rk from 'i18n!Controls';
/**
 * Функция проверяет наличие булевого значения в контейнере.
 * @class Controls/_toggle/isRequired
 * @public
 * @remark
 * Подробнее о работе с валидацией читайте {@link /doc/platform/developmentapl/interface-development/forms-and-validation/validation/ здесь}.
 *
 * Аргументы функции:
 *
 * * value: Boolean|Null  - проверяемое значение.
 * * triState: Boolean - Говорит о том, что у проверяемого значения может быть состояние "не определен".
 * * doNotValidate:Boolean — требуется ли валидация.
 *
 * Если типы проверяемых значений отличны от Boolean, используйте валидатор {@link Controls/validate:isRequired}.
 *
 * Типы возвращаемых значений:
 *
 * * true — значение прошло проверку на валидность.
 * * string — значение не прошло проверку на валидность, возвращается текст сообщения об ошибке.
 *
 * @example
 * <pre>
 * <Controls.validate:Container>
 *    <ws:validators>
 *       <ws:Function value="{{_value}}" triState="{{false}}"> Controls/toggle:isRequired</ws:Function>
 *    </ws:validators>
 *    <ws:content>
 *       <Controls.checkbox:Checkbox bind:value="_value"/>
 *    </ws:content>
 * </Controls.validate:Container>
 * </pre>
 */

interface IRequired {
    value: boolean;
    triState?: boolean;
    doNotValidate?: boolean;
}

export default function validate(args: IRequired): string | boolean {
    // Если передали в аргументах doNotValidate, значит возвращаем true
    // (параметр нужен для опционального включения/отключения валидатора)
    if (args.doNotValidate) {
        return true;
    }

    const triState = args.hasOwnProperty('triState') ? args.triState : true;

    let isEmpty = false;

    switch (typeof args.value) {
        case 'boolean':
            if (!triState) {
                isEmpty = args.value === false;
            }
            break;
        case 'object':
            if (triState) {
                isEmpty = true;
            }
            break;
    }

    return isEmpty ? rk('Поле обязательно для заполнения') : true;
}
