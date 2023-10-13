import * as rk from 'i18n!Controls';
import { ObjectType } from 'Types/meta';
import { IFont } from 'Controls-editors/properties';
import { TFontColorStyleType } from './TFontColorStyleType';
import { TFontWeightType } from './TFontWeightType';
import { TFontSizeType } from './TFontSizeType';

export const IFontType = ObjectType.id('Controls/meta:IFontType')
    .title(rk('Шрифт'))
    .description(rk('Параметры шрифта.'))
    .editor(() => {
        return import('Controls-editors/properties').then(({ FontEditor }) => {
            return FontEditor;
        });
    })
    .attributes<IFont>({
        color: TFontColorStyleType,
        weight: TFontWeightType,
        size: TFontSizeType,
    });
