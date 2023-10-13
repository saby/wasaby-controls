import * as rk from 'i18n!Controls';
import { WidgetType, group } from 'Types/meta';
import { INumberInputOptions } from 'Controls/input';
import { INameOptionsType } from '../_interface/INameOptionsType';
import { ISizeOptionsType } from '../_interface/ISizeOptionsType';
import { INumberInputOptionsType } from './INumberInputOptionsType';

export const InputNumberType = WidgetType.id(
    'Controls/meta:InputNumberType'
).attributes<INumberInputOptions>({
    ...INumberInputOptionsType.attributes(),
    ...group('', {
        field: INameOptionsType.order(0),
        onlyPositive: INumberInputOptionsType.attributes().onlyPositive.defaultValue(true).order(1),
        useGrouping: INumberInputOptionsType.attributes().useGrouping.defaultValue(true).order(2),
        integersLength: INumberInputOptionsType.attributes().integersLength.order(3),
        precision: INumberInputOptionsType.attributes().precision.order(4),
        placeholder: INumberInputOptionsType.attributes()
            .placeholder.defaultValue(rk('Укажите число'))
            .order(5),
    }),
    ...group(rk('Стиль'), {
        contrastBackground: INumberInputOptionsType.attributes()
            .contrastBackground.defaultValue(false)
            .order(6),
        ...ISizeOptionsType.attributes(),
    }),
});
