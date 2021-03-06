import { TreeGridCollection } from 'Controls/treeGrid';
import { assert } from 'chai';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';

const RAW_DATA = [
    { key: 1, parent: null, type: true },
    { key: 2, parent: 1, type: true },
    { key: 3, parent: 2, type: null }
];

describe('Controls/treeGrid_clean/Display/TreeCollection', () => {
    it('Restore expandedItems after reset collection', () => {
        const recordSet = new RecordSet({
            rawData: [ { key: 1, parent: null, type: true } ],
            keyProperty: 'key'
        });

        const treeGridCollection = new TreeGridCollection({
            collection: recordSet,
            keyProperty: 'key',
            parentProperty: 'parent',
            nodeProperty: 'type',
            root: null,
            columns: [{}],
            expandedItems: [1]
        });

        recordSet.merge(new RecordSet({
            rawData: RAW_DATA,
            keyProperty: 'key'
        }));
        assert.strictEqual(treeGridCollection.getCount(), 2);
    });

    it('setExpandedItems for deep into nodes', () => {
        const recordSet = new RecordSet({
            rawData: [
                { key: 1, parent: null, type: true },
                { key: 2, parent: 1, type: true },
                { key: 3, parent: 2, type: true }
            ],
            keyProperty: 'key'
        });

        const treeGridCollection = new TreeGridCollection({
            collection: recordSet,
            keyProperty: 'key',
            parentProperty: 'parent',
            nodeProperty: 'type',
            root: null,
            columns: [{}],
            expandedItems: []
        });
        treeGridCollection.setExpandedItems([1, 2, 3]);

        assert.isTrue(treeGridCollection.at(0).isExpanded());
        assert.isTrue(treeGridCollection.at(1).isExpanded());
        assert.isTrue(treeGridCollection.at(2).isExpanded());
    });

    it('Init footer in constructor', () => {
        const recordSet = new RecordSet({
            rawData: [ { key: 1, parent: null, type: true } ],
            keyProperty: 'key'
        });

        // ?? ???????????? ???????????????? ???????????? ?????????????? ?????? ???????????? -> ?????????? ???????????? ??????????????????????????????????????????
        let collection = new TreeGridCollection({
            collection: recordSet,
            keyProperty: 'key',
            parentProperty: 'parent',
            nodeProperty: 'type',
            root: null,
            columns: [{}],
            footer: []
        });
        assert.isTrue(!!collection.getFooter());

        // ?? ???????????? ?????????????? ???????????? ???????????? ?????? ???????????? -> ?????????? ???????????? ??????????????????????????????????????????
        const footerTemplate = 'my custom footer template';
        collection = new TreeGridCollection({
            collection: recordSet,
            keyProperty: 'key',
            parentProperty: 'parent',
            nodeProperty: 'type',
            root: null,
            columns: [{}],
            footerTemplate
        });
        assert.isTrue(!!collection.getFooter());
        assert.isTrue(footerTemplate === collection.getFooter().getColumns()[0].getTemplate());
    });

    describe('Reset header model on collection change', () => {

        describe('headerVisibility === \'hasdata\'', () => {
            // ???????????????? ?????? ?????? ?????????????? ???????????? ?????????????????? ???????????? ?????????????????? ????????????????????????
            it('Should reset header model to null on clear collection', () => {
                const recordSet = new RecordSet({rawData: [{id: 0}, {id: 1}], keyProperty: 'id'});
                // ???????????????? ?????????????????? ?? ?????????????? ?? ???????????????????? ??????????????????, ?????????????????? ???? ?????????????? ????????????
                const collection = new TreeGridCollection({
                    keyProperty: 'id',
                    nodeProperty: 'type',
                    parentProperty: 'parent',
                    columns: [],
                    header: [{}, {}],
                    headerVisibility: 'hasdata',
                    collection: recordSet
                });

                // 1. ???????????????? ?????? ?????????????????? ????????????????
                assert.isTrue(!!collection.getHeader());
                // 2. ?????????????? ????????????
                recordSet.clear();
                // 3. ???????????? ?????????????????? ???????????? ???????????????????? ??.??. ???????????? ?? RecordSet ???? ??????????
                assert.isNull(collection.getHeader(), 'Header model should reset to null');
            });

            // ???????????????? ?????? ?????? ???????????????????? ?????????????????? ???????????? ?????????????????? ??????????????????
            it('Should create header model on fill collection', () => {
                const recordSet = new RecordSet({rawData: [], keyProperty: 'id'});
                // ???????????????? ?????????????????? ?????? ???????????? ?? ???????????????????? ??????????????????, ?????????????????? ???? ?????????????? ????????????
                const collection = new TreeGridCollection({
                    keyProperty: 'id',
                    nodeProperty: 'type',
                    parentProperty: 'parent',
                    columns: [],
                    header: [{}, {}],
                    headerVisibility: 'hasdata',
                    collection: recordSet
                });

                // 1. ???????????????? ?????? ?????????????????? ??????
                assert.isFalse(!!collection.getHeader());
                // 2. ???????????????? ?? RecordSet ?????????? ????????????
                recordSet.assign([new Model({keyProperty: 'id', rawData: {id: 1}})]);
                // 3. ???????????? ?????????????????? ???????????? ????????, ??.??. ?????????????????? ????????????
                assert.isTrue(!!collection.getHeader(), 'Header model should exist');
            });
        });

        describe('headerVisibility === \'visible\'', () => {
            // ???????????????? ?????? ?????? ?????????????? ???????????? ?????????????????? ???????????? ?????????????????? ???? ??????????????????????????
            it('Should not recreate header model on clear collection', () => {
                const recordSet = new RecordSet({rawData: [{id: 1}, {id: 2}], keyProperty: 'id'});
                // ???????????????? ?????????????????? ?? ?????????????? ?? ???????????? ?????????????? ????????????????????
                const collection = new TreeGridCollection({
                    keyProperty: 'id',
                    nodeProperty: 'type',
                    parentProperty: 'parent',
                    columns: [],
                    header: [{}, {}],
                    headerVisibility: 'visible',
                    collection: recordSet
                });

                // ???????????????? ?????????????????????? ?????????????? ???????????? ?????????????????? ?? ???????????????? ?????? ???? ????????
                const firstHeaderModel = collection.getHeader();
                assert.isTrue(!!firstHeaderModel, 'Header model should exist');

                // ?????????????? ????????????
                recordSet.clear();

                // ?????????????????? ?????? ?????????? ?????????????????? ?????????????????? ???????????? ?????????????????? ???????????????? ?????? ????
                const secondHeaderModel = collection.getHeader();
                assert.isTrue(!!secondHeaderModel, 'Header model should exist');
                assert.isTrue(firstHeaderModel === secondHeaderModel, 'Should be the same header model instance');
            });

            // ???????????????? ?????? ?????? ???????????????????? ?????????????????? ???????????? ?????????????????? ???? ??????????????????????????
            it('Should recreate header model on fill collection', () => {
                const recordSet = new RecordSet({rawData: [], keyProperty: 'id'});
                // ???????????????? ?????????????????? ?????? ???????????? ?? ???????????? ?????????????? ????????????????????
                const collection = new TreeGridCollection({
                    keyProperty: 'id',
                    nodeProperty: 'type',
                    parentProperty: 'parent',
                    columns: [],
                    header: [{}, {}],
                    headerVisibility: 'visible',
                    collection: recordSet
                });

                // ???????????????? ?????????????????????? ?????????????? ???????????? ?????????????????? ?? ???????????????? ?????? ???? ????????
                const firstHeaderModel = collection.getHeader();
                assert.isTrue(!!firstHeaderModel, 'Header model should exist');

                // ?????????????? ???????????? ?? RecordSet
                recordSet.assign([new Model({keyProperty: 'id', rawData: { parent: null }})]);

                // ?????????????????? ?????? ?????????? ?????????????????? ?????????????????? ???????????? ?????????????????? ???????????????? ?????? ????
                const secondHeaderModel = collection.getHeader();
                assert.isTrue(!!secondHeaderModel, 'Header model should exist');
                assert.isTrue(firstHeaderModel === secondHeaderModel, 'Should be the same header model instance');
            });
        });

    });
});
