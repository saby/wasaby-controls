import { ObjectType, ResourceType, StringType } from 'Meta/types';
import * as rk from 'i18n!Controls-meta';

const BackgroundType = ObjectType.id('Controls-meta/background:IBackgroundType')
    .title(rk('Фон'))
    .title(rk('Настройка фона'))
    .optional()
    .editor('Controls-editors/properties:BackgroundEditor')
    .defaultValue({})
    .properties({
        image: ObjectType.properties({
            resource: ResourceType,
        }),
        backgroundColor: StringType.optional(),
        dominantColorRGB: StringType.optional(),
        texture: StringType.optional(),
    });

export { BackgroundType };
