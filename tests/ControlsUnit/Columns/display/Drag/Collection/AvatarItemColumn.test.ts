import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { ColumnsCollection, ColumnsCollectionItem as CollectionItem } from 'Controls/columns';
import ColumnsDrag from 'Controls/_columns/display/itemsStrategy/ColumnsDrag';

describe('Controls/columns/display/Drag/Collection/AvatarItemColumn', () => {
    let model: ColumnsCollection;
    let items;
    let list;

    interface IItem {
        id: number;
        name?: string;
    }

    function getItems(): IItem[] {
        return [
            {
                id: 1,
                name: 'Иванов',
            },
            {
                id: 2,
                name: 'Петров',
            },
            {
                id: 3,
                name: 'Сидоров',
            },
            {
                id: 4,
                name: 'Пухов',
            },
            {
                id: 5,
                name: 'Молодцов',
            },
            {
                id: 6,
                name: 'Годолцов',
            },
            {
                id: 7,
                name: 'Арбузнов',
            },
        ];
    }

    beforeEach(() => {
        items = getItems();
        list = new RecordSet({
            rawData: items,
            keyProperty: 'id',
        });
        model = new ColumnsCollection<Model, CollectionItem<Model>>({
            collection: list,
            columnsCount: 2,
            keyProperty: 'id',
        });
    });

    // Тестируем что при попытке переместить элемент в колонке, колонка должна учитываться.
    it('should set column for dragged item avatar', () => {
        const item = model.at(2);
        item.setColumn(1);

        model.setDraggedItems(model.getItemBySourceKey(3), [3]);
        const strategy = model.getStrategyInstance(ColumnsDrag);
        expect(strategy.avatarItem.getColumn()).toEqual(1);
    });

    it('not should set column if drag on folder', () => {
        model.setDraggedItems(model.getItemBySourceKey(3), [3]);
        const strategy = model.getStrategyInstance(ColumnsDrag);
        expect(strategy.avatarItem.getColumn()).toEqual(0);

        const newPosition = {
            dispItem: model.getItemBySourceKey(6),
            index: 5,
            position: 'on',
        };
        model.setDragPosition(newPosition);
        expect(strategy.avatarItem.getColumn()).toEqual(0);
        expect(newPosition.dispItem.getColumn()).toEqual(1);
    });

    it('should set column for avatar item if drag to another column', () => {
        model.setDraggedItems(model.getItemBySourceKey(3), [3]);
        const strategy = model.getStrategyInstance(ColumnsDrag);
        expect(strategy.avatarItem.getColumn()).toEqual(0);

        const newPosition = {
            dispItem: model.getItemBySourceKey(6),
            index: 5,
            position: 'before',
        };
        model.setDragPosition(newPosition);
        expect(strategy.avatarItem.getColumn()).toEqual(1);
    });

    it('should set parent for dragged item avatar', () => {
        model.setDraggedItems(model.getItemBySourceKey(3), [3]);
        const strategy = model.getStrategyInstance(ColumnsDrag);
        expect(strategy.avatarItem.getParent()).toEqual(model.getRoot());
    });
});
