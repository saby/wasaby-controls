/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import { IEditableCollectionItem } from './IEditableCollectionItem';
import { IBaseCollection } from 'Controls/_display/interface';
import { Model } from 'Types/entity';

export interface IEditableCollection extends IBaseCollection<Model, IEditableCollectionItem> {
    setAddingItem(item: IEditableCollectionItem): void;
    resetAddingItem(): void;
    setEditing(isEditing: boolean): void;
}
