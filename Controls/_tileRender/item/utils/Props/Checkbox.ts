import { TileCollectionItem, TileCollection } from 'Controls/tile';

import { Model } from 'Types/entity';
import { ICheckboxProps, TVisibility } from 'Controls/interface';

interface IGetCheckboxProps {
    collectionItem: TileCollectionItem;
    collection: TileCollection<Model<any>>;
}

export interface ITileCheckboxProps
    extends Pick<ICheckboxProps, 'checkboxVisibility' | 'checkboxClassName' | 'checkboxValue'> {}

/**
 * Возвращает базовые пропсы чекбокса для элемента плитки
 **/
export function getCheckboxProps({
    collectionItem,
    collection,
}: IGetCheckboxProps): ITileCheckboxProps {
    return {
        checkboxValue: collectionItem.isSelected(),
        checkboxVisibility: collection.getMultiSelectVisibility() as TVisibility,
        checkboxClassName: collectionItem.getMultiSelectClasses(),
    };
}
