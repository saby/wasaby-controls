import { ObjectType, StringType, UnknownType, BooleanType, NumberType } from 'Meta/types';
import { IActionOptions } from 'Controls-Input/interface';
import * as translate from 'i18n!Controls-Input';

/**
 * Определяет интерфейс редактора, описывающего действие кнопки.
 * @public
 */
export const IActionTypeMeta = ObjectType.id('Controls-Input-meta/interface:IActionTypeMeta')
    .properties<IActionOptions>({
        id: StringType,
        actionProps: UnknownType,
        hotKey: ObjectType.properties({
            keyCode: NumberType,
            altKey: BooleanType,
            ctrlKey: BooleanType,
            shiftKey: BooleanType,
        }).optional(),
    })
    .title(translate('Действие'))
    .editor('Controls-Input-editors/ActionEditor:ActionEditor')
    .defaultValue({})
    .optional();
