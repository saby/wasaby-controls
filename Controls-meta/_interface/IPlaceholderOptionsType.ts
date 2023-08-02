import * as rk from 'i18n!Controls';
import { ObjectType, StringType, NullType } from 'Types/meta';
import { IInputPlaceholderOptions } from 'Controls/interface';

export const IPlaceholderOptionsType = ObjectType.id(
    'Controls/meta:IPlaceholderOptionsType'
).attributes<IInputPlaceholderOptions>({
    placeholder: StringType.title(rk('Подсказка')).description(
        rk(
            'Текст подсказки, который отображается в пустом поле ввода до того, как пользователь вводит значение.'
        )
    ),
    placeholderVisibility: NullType,
});
