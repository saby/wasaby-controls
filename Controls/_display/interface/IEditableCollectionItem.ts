/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
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
