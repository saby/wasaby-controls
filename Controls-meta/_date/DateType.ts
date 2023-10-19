import * as rk from 'i18n!Controls';
import { WidgetType, group } from 'Types/meta';
import { IDateBaseOptions } from 'Controls/date';
import { IBaseOptionsType } from '../_input/IBaseOptionsType';
import { IControlOptionsType } from '../_interface/IControlOptionsType';
import { IBaseInputOptionsType } from '../_input/IBaseInputOptionsType';
import { IBaseInputMaskOptionsType } from '../_date/IBaseInputMaskOptionsType';
import { IValueValidatorsType } from '../_date/IValueValidatorsType';
import { IInputDisplayValueOptionsType } from '../_input/IInputDisplayValueOptionsType';
import { IDateValueOptionsType } from '../_date/IDateValueOptionsType';
import { TInputAutoComplete } from '../_input/TInputAutoComplete';

export const DateType = WidgetType.id('Controls/meta:DateType')
    .title(rk('универсальное поле ввода даты и времени'))
    .description(
        rk(
            'Позволяет вводить дату и время одновременно или по отдельности. Данные вводятся только с помощью клавиатуры'
        )
    )
    .category(rk('Контролы'))
    .attributes<IDateBaseOptions>({
        ...group(rk('Внешний вид'), {
            ...IBaseOptionsType.attributes(),
            ...IControlOptionsType.attributes(),
            ...IBaseInputMaskOptionsType.attributes(),
        }),
        ...group(rk('Значение'), {
            ...IBaseInputOptionsType.attributes(),
            ...IValueValidatorsType.attributes(),
            ...IInputDisplayValueOptionsType.attributes(),
            ...IDateValueOptionsType.attributes(),
            autocompleteType: TInputAutoComplete,
        }),
    });
