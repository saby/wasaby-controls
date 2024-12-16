import { ObjectType, StringType, NumberType, group } from 'Meta/types';

import * as rk from 'i18n!Controls-meta';

export const SizeType = ObjectType.properties({
    ...group(rk('Размер'), {
        width: StringType.title(rk('Ширина')).optional(),
        height: StringType.title(rk('Высота')).optional(),
        maxWidth: StringType.title(rk('Max ширина')).optional(),
        maxHeight: StringType.title(rk('Max высота')).optional(),
        minWidth: StringType.title(rk('Min ширина')).optional(),
        minHeight: StringType.title(rk('Min высота')).optional(),
        aspectRatio: NumberType.hidden().optional(),
    }),
})
    .optional()
    .editor('Controls-editors/sizeEditor:ComplexSizeEditor');
