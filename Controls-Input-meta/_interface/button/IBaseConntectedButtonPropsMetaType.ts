import { group, ObjectType } from 'Meta/types';
import * as translate from 'i18n!Controls-Input';
import { ICaptionTypeMeta } from './ICaptionTypeMeta';
import { IIconOptionsType } from './IIconOptionsType';
import { ITooltipTypeMeta } from './ITooltipTypeMeta';
import { IBaseButtonProps } from 'Controls-Input/buttonConnected';

export const IBaseConntectedButtonPropsMetaType = ObjectType.id(
    'Controls-Input/buttonConnected:IBaseButtonProps'
).properties<IBaseButtonProps>({
    ...group('', {
        caption: ICaptionTypeMeta.order(10).optional().defaultValue(translate('Кнопка')),
        tooltip: ITooltipTypeMeta.order(20).optional().defaultValue(''),
        ...IIconOptionsType.properties(),
    }),
});
