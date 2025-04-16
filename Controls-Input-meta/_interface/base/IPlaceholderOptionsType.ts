import * as rk from 'i18n!Controls-Input';
import { NullType, ObjectType, StringType } from 'Meta/types';
import { getDefaultPlaceholder } from 'Controls-Input/utils';

interface IInputPlaceholderOptions {
    placeholder?: string;
    placeholderVisibility?: 'empty' | 'editable' | 'hidden';
}

export const IPlaceholderOptionsType = ObjectType.id(
    'Controls-Input-meta/inputConnected:IPlaceholderOptionsType'
)
    .properties<IInputPlaceholderOptions>({
        placeholder: StringType.title(getDefaultPlaceholder())
            .description(
                rk(
                    'Текст подсказки, который отображается в пустом поле ввода до того, как пользователь вводит значение.'
                )
            )
            .editor('Controls-Input-editors/placeholderEditor:PlaceholderEditor', {
                placeholder: getDefaultPlaceholder(),
                shortPlaceholder: rk('подсказка'),
                titlePosition: 'none',
            })
            .optional()
            .defaultValue(''),
        placeholderVisibility: NullType,
    })
    .defaultValue({});
