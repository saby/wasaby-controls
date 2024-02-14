import { NumberType, ObjectType } from 'Types/meta';
import { IVisibleItemsCountOptions } from 'Controls-Input/interface';

export const IVisibleItemsCountType = ObjectType.id('Controls/meta:IVisibleItemsCountType')
    .attributes<IVisibleItemsCountOptions>({
        visibleItemsCount: NumberType.title(null)
            .editor(() => {
                return import('Controls-editors/properties').then(({VisibleItemsCountEditor}) => {
                    return VisibleItemsCountEditor;
                });
            }, {})
            .defaultValue(null),
    })
    .defaultValue({});
