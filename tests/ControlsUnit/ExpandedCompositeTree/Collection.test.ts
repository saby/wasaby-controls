import { RecordSet } from 'Types/collection';
import {
    Collection,
    CollectionItem,
    CompositeCollectionItem,
} from 'Controls/expandedCompositeTree';
import { TPaddingSize } from 'Controls/interface';
import { CssClassesAssert } from 'ControlsUnit/CustomAsserts';

describe('Controls/ExpandCompositeTree/Collection', () => {
    it('should have platform css classes for every item', () => {
        const collection = new Collection({
            root: null,
            keyProperty: 'key',
            parentProperty: 'parent',
            nodeProperty: 'type',
            compositeViewConfig: {
                itemPadding: {
                    left: 's' as TPaddingSize,
                    right: 's' as TPaddingSize,
                },
            },
            itemPadding: {
                left: 'xs' as TPaddingSize,
                right: 'xs' as TPaddingSize,
            },
            collection: new RecordSet({
                keyProperty: 'key',
                rawData: [
                    { key: 'node_1', parent: null, type: true },
                    { key: 'node_1_1', parent: 'node_1', type: true },
                    { key: 'leaf_1_1_1', parent: 'node_1_1', type: null },
                    { key: 'leaf_1_1_2', parent: 'node_1_1', type: null },
                    { key: 'leaf_1_1_3', parent: 'node_1_1', type: null },
                    { key: 'leaf_1_1_4', parent: 'node_1_1', type: null },
                    { key: 'leaf_1_1_5', parent: 'node_1_1', type: null },
                    { key: 'leaf_1_1_6', parent: 'node_1_1', type: null },
                    { key: 'node_1_1_1', parent: 'node_1_1', type: true },
                    { key: 'node_1_1_2', parent: 'node_1_1', type: true },
                    { key: 'node_1_1_3', parent: 'node_1_1', type: true },
                    { key: 'node_1_1_4', parent: 'node_1_1', type: true },
                    { key: 'node_1_1_5', parent: 'node_1_1', type: true },
                    { key: 'node_1_1_6', parent: 'node_1_1', type: true },
                ],
            }),
        });
        const items = collection.getItems();
        // Отступ у папок-заголовков 1 и 2 уровней=xs
        CssClassesAssert.include((items[0] as CollectionItem).getContentClasses(), [
            'controls-padding_left-xs',
            'controls-padding_right-xs',
        ]);
        // Отступ у контейнера с горизонтальной плиткой=xs
        CssClassesAssert.include(
            (items[3] as unknown as CompositeCollectionItem).getPaddingClasses(),
            ['controls-padding_left-xs', 'controls-padding_right-xs']
        );
        // Отступ у контейнера с плиткой=xs
        CssClassesAssert.include(
            (items[4] as unknown as CompositeCollectionItem).getPaddingClasses(),
            ['controls-padding_left-xs', 'controls-padding_right-xs']
        );
    });
});
