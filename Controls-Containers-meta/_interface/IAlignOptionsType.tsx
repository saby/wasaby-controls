import { ObjectType, StringType } from 'Meta/types';
import { RecordSet } from 'Types/collection';
import * as rk from 'i18n!Controls-Containers';

enum AlignVariant {
    LEFT = 'left',
    RIGHT = 'right',
}

const AlignOptions: readonly AlignVariant[] = [
    AlignVariant.LEFT,
    AlignVariant.CENTER,
    AlignVariant.RIGHT,
] as const;

const tumblerIconOptions = new RecordSet({
    rawData: [
        {
            id: AlignVariant.LEFT,
            icon: 'icon-TileLeftSide',
        },
        {
            id: AlignVariant.RIGHT,
            icon: 'icon-TileRightSide',
        },
    ],
    keyProperty: 'id',
});

export const IAlignOptionsType = ObjectType.id(
    'Controls-Containers-meta/interface:IAlignOptionsType'
)
    .title(rk('Выравнивание'))
    .description(rk('Выравнивание'))
    .properties({
        align: StringType.oneOf(AlignOptions)
            .title(rk('Выравнивание'))
            .editor('Controls-editors/toggle:TumblerEditor', {
                options: tumblerIconOptions,
            })
            .optional()
            .defaultValue(AlignVariant.LEFT)
            .order(3),
    });
