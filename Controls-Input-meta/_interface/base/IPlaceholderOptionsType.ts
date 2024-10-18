import * as rk from 'i18n!Controls-Input';
import { NullType, ObjectType, StringType } from 'Meta/types';

interface IInputPlaceholderOptions {
    placeholder: string;
    placeholderVisibility: 'empty' | 'editable' | 'hidden';
}

export const IPlaceholderOptionsType = ObjectType.id(
    'Controls-Input-meta/inputConnected:IPlaceholderOptionsType'
)
    .properties<IInputPlaceholderOptions>({
        placeholder: StringType.title(rk('Подсказка'))
            .description(
                rk(
                    'Текст подсказки, который отображается в пустом поле ввода до того, как пользователь вводит значение.'
                )
            )
            .optional()
            .defaultValue(''),
        placeholderVisibility: NullType,
    })
    .defaultValue({});
