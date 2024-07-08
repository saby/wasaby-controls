/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import { Model } from 'Types/entity';
import { ICollectionItem } from 'Controls/_display/interface/ICollectionItem';

export interface IEditableCollectionItem<T extends Model = Model> extends ICollectionItem {
    readonly EditableItem: boolean;
    contents: T;

    isAdd: boolean;

    setEditing(
        isEditing: boolean,
        editingContents?: Model<T>,
        silent?: boolean,
        columnIndex?: number
    ): void;
    isEditing(): boolean;
    acceptChanges(): void;
}
