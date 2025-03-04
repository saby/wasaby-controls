/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import { CollectionItem } from 'Controls/display';
import { getPropertyGridCollectionItem } from './getPropertyGridCollectionItem';

export type TPropertyGridCollectionItemConstructor = ReturnType<
    typeof getPropertyGridCollectionItem
>;
export type TPropertyGridCollectionItem = TPropertyGridCollectionItemConstructor['prototype'];

export default getPropertyGridCollectionItem(CollectionItem, 'propertyGridBase');
