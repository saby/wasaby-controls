import * as translate from 'i18n!Controls-Buttons';
import { ObjectType } from 'Types/meta';
import { IFont } from 'Controls-editors/properties';
import { TFontColorStyleType } from './../types/TFontColorStyleType';
import { TFontWeightType } from './../types/TFontWeightType';
import { TFontSizeType } from './../types/TFontSizeType';

export const IFontType = ObjectType.id('Controls/meta:IFontType')
    .title(translate('Шрифт'))
    .description(translate('Параметры шрифта.'))
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
