/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import { Collection } from 'Controls/display';
import { getPropertyGridCollection } from './getPropertyGridCollection';

export type TPropertyGridCollectionConstructor = ReturnType<typeof getPropertyGridCollection>;
export type TPropertyGridCollection = TPropertyGridCollectionConstructor['prototype'];

export default getPropertyGridCollection(Collection, 'propertyGridBase');
