/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import { Tree } from 'Controls/baseTree';
import { getPropertyGridCollection } from 'Controls/propertyGridBase';
import PropertyGridGroupItem from './PropertyGridGroupItem';

export default getPropertyGridCollection(Tree, 'propertyGrid', PropertyGridGroupItem);
