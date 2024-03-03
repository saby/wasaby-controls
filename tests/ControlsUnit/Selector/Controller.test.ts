import { Model } from 'Types/entity';
import { List } from 'Types/collection';
import { Controller } from 'Controls/lookupPopup';

const getSelectedItems = (itemsCount?: number) => {
    const items = new List<Model>();

    itemsCount = isNaN(itemsCount) ? 5 : itemsCount;

    for (let i = 0; i < itemsCount; i++) {
        items.add(
            new Model({
                rawData: {
                    id: i,
                    otherId: 'otherId-' + i,
                    title: 'title-' + i,
                },
                keyProperty: 'id',
            })
        );
    }

    return items;
};

describe('Controls/_lookupPopup/Controller', () => {
    it('addItemToSelected', () => {
        const itemNew = new Model({
            rawData: {
                id: 'test',
                title: 'test',
            },
        });
        const itemToReplace = new Model({
            rawData: {
                id: 0,
                title: 'test',
            },
        });
        const selectedItems = getSelectedItems();

        Controller._addItemToSelected(itemNew, selectedItems, 'id');
        expect(selectedItems.getCount()).toEqual(6);
        expect(selectedItems.at(5).get('title')).toEqual('test');

        Controller._addItemToSelected(itemToReplace, selectedItems, 'id');
        expect(selectedItems.getCount()).toEqual(6);
        expect(selectedItems.at(0).get('title')).toEqual('test');
    });

    it('removeFromSelected', () => {
        const selectedItems = getSelectedItems();
        const itemToRemove = new Model({
            rawData: {
                id: 0,
                title: 'test',
            },
        });

        Controller._removeFromSelected(itemToRemove, selectedItems, 'id');

        expect(selectedItems.getCount()).toEqual(4);
        expect(selectedItems.at(0).get('id')).toEqual(1);
    });

    describe('processSelectionResult', () => {
        it('multiSelect is not "false"', () => {
            const selectedItems = getSelectedItems();
            const newSelected = getSelectedItems();
            const result = {
                initialSelection: getSelectedItems().clone(),
                resultSelection: newSelected,
                keyProperty: 'id',
            };

            newSelected.removeAt(0);
            newSelected.removeAt(0);
            newSelected.removeAt(2);
            Controller._processSelectionResult([result], selectedItems);

            expect(selectedItems.getCount()).toEqual(2);
            expect(selectedItems.at(0).get('id')).toEqual(2);
            expect(selectedItems.at(1).get('id')).toEqual(3);

            selectedItems.clear();
            Controller._processSelectionResult([result], selectedItems, true, 'otherId');

            expect(selectedItems.getCount()).toEqual(2);
            expect(selectedItems.at(0).get('otherId')).toEqual('otherId-2');
            expect(selectedItems.at(1).get('otherId')).toEqual('otherId-3');
        });

        describe('multiSelect is "false"', () => {
            const selectedItems = getSelectedItems(0);
            const newSelectedItems = getSelectedItems(1);
            const result = {
                initialSelection: [],
                resultSelection: newSelectedItems,
                keyProperty: 'id',
                selectCompleteInitiator: false,
            };

            it('selectCompleteInitiator is "false"', () => {
                Controller._processSelectionResult([result], selectedItems, false);

                expect(selectedItems.getCount()).toEqual(0);
            });

            it('selectCompleteInitiator is "true"', () => {
                result.selectCompleteInitiator = true;
                Controller._processSelectionResult([result], selectedItems, false);

                expect(selectedItems.getCount()).toEqual(1);
            });
        });
    });
});
