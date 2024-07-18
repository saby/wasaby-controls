import { NumberType, ObjectType } from 'Meta/types';
import { IVisibleItemsCountOptions } from 'Controls-Input/interface';

export const IVisibleItemsCountType = ObjectType.id('Controls/meta:IVisibleItemsCountType')
    .attributes<IVisibleItemsCountOptions>({
        visibleItemsCount: NumberType.title(null)
            .editor('Controls-editors/properties:VisibleItemsCountEditor')
            .defaultValue(null),
    })
    .defaultValue({});
