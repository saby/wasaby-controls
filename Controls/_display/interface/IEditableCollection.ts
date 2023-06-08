/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import { IEditableCollectionItem } from './IEditableCollectionItem';
import { IBaseCollection } from 'Controls/_display/interface';
import { Model } from 'Types/entity';

export interface IEditableCollection
    extends IBaseCollection<Model, IEditableCollectionItem> {
    setAddingItem(item: IEditableCollectionItem): void;
    resetAddingItem(): void;
    setEditing(isEditing: boolean): void;
}
