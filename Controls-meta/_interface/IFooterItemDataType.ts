import { ObjectType } from 'Types/meta';
import { IFooterItemData } from 'Controls/menu';
import { ModelType } from './ModelType';
import { TEntityKeyType } from './TEntityKeyType';

export const IFooterItemDataType = ObjectType.id(
    'Controls/meta:IFooterItemDataType'
).attributes<IFooterItemData>({
    item: ModelType,
    key: TEntityKeyType,
});
