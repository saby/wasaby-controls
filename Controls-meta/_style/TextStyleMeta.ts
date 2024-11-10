/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ObjectType, StringType } from 'Meta/types';
import * as rk from 'i18n!Controls-meta';

const FontFamilyType = StringType.title(rk('Шрифт'))
    .order(0)
    .optional()
    .editor('Controls-editors/style:FontFamilyEditor');

const FontSizeType = StringType.title(rk('Размер'))
    .optional()
    .order(1)
    .editor('Controls-editors/style:FontSizeEditor');

const DecoratorType = ObjectType.title(rk('Декорирование'))
    .optional()
    .order(3)
    .properties({
        textDecoration: StringType,
        fontStyle: StringType,
        fontWeight: StringType,
    })
    .editor('Controls-editors/style:TextDecoratorEditor');

const TextAlignType = StringType.title(rk('Выравнивание'))
    .optional()
    .order(4)
    .editor('Controls-editors/style:TextAlignEditor');

const LineHeightType = StringType.title(rk('Высота строки'))
    .optional()
    .order(5)
    .editor('Controls-editors/style:LineHeightEditor');

const TextTransformType = StringType.title(rk('Формат строки'))
    .optional()
    .order(6)
    .editor('Controls-editors/style:TextTransformEditor');

export const TextStyleMeta = ObjectType.id('StyleMeta').properties({
    fontFamily: FontFamilyType,
    fontSize: FontSizeType,
    decorator: DecoratorType,
    textAlign: TextAlignType,
    lineHeight: LineHeightType,
    textTransform: TextTransformType,
});

export const TextStyleHoverMeta = ObjectType.id('StyleHoverMeta').properties({
    fontSize: FontSizeType,
    decorator: DecoratorType,
});

export const TextStyleActiveMeta = TextStyleHoverMeta.id('StyleActiveMeta');
