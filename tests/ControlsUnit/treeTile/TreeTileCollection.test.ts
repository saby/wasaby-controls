import { RecordSet } from 'Types/collection';
import { TreeTileCollection } from 'Controls/treeTile';
import { groupConstants } from 'Controls/baseList';

describe('Controls/_treeTile/display/TreeTileCollection', () => {
    describe('::getItems', () => {
        it("first item should'n t be invisible", () => {
            const items = new RecordSet({
                rawData: [
                    {
                        id: 1,
                        node: false,
                        parent: null,
                        group: groupConstants.hiddenGroup,
                    },
                    { id: 2, node: false, parent: null, group: 'g1' },
                ],
                keyProperty: 'id',
            });
            const model = new TreeTileCollection({
                collection: items,
                keyProperty: 'id',
                root: null,
                groupProperty: 'group',
                nodeProperty: 'node',
                parentProperty: 'parent',
                tileMode: 'static',
            });
            expect(model.at(0).key.indexOf('invisible')).toBeLessThan(0);
        });
    });

    describe('::getChildren', () => {
        it("shouldn't return invisible items", () => {
            const items = new RecordSet({
                rawData: [{ id: 1, node: true, parent: null }],
                keyProperty: 'id',
            });
            const model = new TreeTileCollection({
                collection: items,
                keyProperty: 'id',
                root: null,
                nodeProperty: 'node',
                parentProperty: 'parent',
                tileMode: 'static',
            });
            // проверяем что в модели точно есть невидимые элементы
            expect(model.getCount()).toEqual(12);
            // проверяем что метод getChildren не возвращает невидимые элементы
            expect(model.getChildren(model.getRoot()).getCount()).toEqual(1);
        });
    });
});
