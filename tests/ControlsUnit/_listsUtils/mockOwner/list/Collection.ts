import type { Collection, ICollectionOptions } from 'Controls/display';
import type { Model } from 'Types/entity';
import { extractParam } from '../helpers';

export interface ICollectionMockParams {
    rowSeparatorSize?: ICollectionOptions['rowSeparatorSize'];
    isBottomSeparatorEnabled?: boolean;
    multiSelectVisibility?: ICollectionOptions['multiSelectVisibility'];
    multiSelectPosition?: ICollectionOptions['multiSelectPosition'];
    leftPadding?: ICollectionOptions['itemPadding']['left'];
    rightPadding?: ICollectionOptions['itemPadding']['right'];
    topPadding?: ICollectionOptions['itemPadding']['top'];
    bottomPadding?: ICollectionOptions['itemPadding']['bottom'];
    editingConfig?: ICollectionOptions['editingConfig'];

    isDragging?: boolean;
    isEditing?: boolean;

    isStickyHeader?: boolean;
    isStickyResults?: boolean;
    isStickyGroup?: boolean;
    isStickyFooter?: boolean;
}

export function getCollectionMock<TData extends unknown>(
    params: ICollectionMockParams = {}
): Collection<Model<TData>> {
    const get = (pName: keyof ICollectionMockParams, defaultValue: unknown) => {
        return extractParam(params, pName, defaultValue);
    };

    return {
        getEditingConfig: () => {
            return get('editingConfig', {});
        },
        getMultiSelectVisibility: () => {
            return get('multiSelectVisibility', 'hidden');
        },
        getMultiSelectPosition: () => {
            return get('multiSelectPosition', 'default');
        },
        getLeftPadding: () => {
            return get('leftPadding', 'default');
        },
        getRightPadding: () => {
            return get('rightPadding', 'default');
        },
        getTopPadding: () => {
            return get('topPadding', 'default');
        },
        getBottomPadding: () => {
            return get('bottomPadding', 'default');
        },
        getRowSeparatorSize: () => {
            return get('rowSeparatorSize', null);
        },
        isBottomSeparatorEnabled: () => {
            return get('isBottomSeparatorEnabled', false);
        },
        isStickyHeader: () => {
            return get('isStickyHeader', false);
        },
        isStickyFooter: () => {
            return get('isStickyFooter', false);
        },
        isStickyGroup: () => {
            return get('isStickyGroup', false);
        },
        isStickyResults: () => {
            return get('isStickyResults', false);
        },
        isDragging: () => {
            return get('isDragging', false);
        },
        isEditing: () => {
            return get('isEditing', false);
        },

        notifyItemChange: jest.fn(),
    } as unknown as Collection<Model<TData>>;
}
