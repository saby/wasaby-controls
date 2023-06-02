import { TGroupNodeVisibility, TreeGridCollection } from 'Controls/treeGrid';
import { RecordSet } from 'Types/collection';
import { CssClassesAssert } from 'ControlsUnit/CustomAsserts';
import { Model } from 'Types/entity';

describe('Controls/treeGrid/display/NodeTypeProperty/TreeGridGroupDataRow/IsHiddenGroup', () => {
    let recordSet: RecordSet;
    let groupNodeVisibility: string;

    function getCollection(options?: {
        collection?: RecordSet;
        groupNodeVisibility?: TGroupNodeVisibility;
    }): TreeGridCollection<any> {
        return new TreeGridCollection({
            collection: options?.collection || recordSet,
            groupNodeVisibility:
                options?.groupNodeVisibility || groupNodeVisibility,
            keyProperty: 'key',
            parentProperty: 'parent',
            nodeProperty: 'type',
            nodeTypeProperty: 'nodeType',
            root: null,
            columns: [{}],
            expandedItems: [1],
        });
    }

    beforeEach(() => {
        groupNodeVisibility = 'hasdata';
        recordSet = new RecordSet({
            rawData: [
                {
                    key: 1,
                    parent: null,
                    type: true,
                    nodeType: 'group',
                },
                {
                    key: 2,
                    parent: 1,
                    type: null,
                    nodeType: null,
                },
            ],
            keyProperty: 'key',
        });
        recordSet.setMetaData({
            singleGroupNode: true,
        });
    });

    describe('constructor', () => {
        // При инциализации списка с единственной группой, singleGroupNode = undefined, groupNodeVisibility = undefined
        // группу надо отобразить
        it('group should not be hidden +groupNodeVisibility=undefined, +singleGroupNode=undefined', () => {
            recordSet.setMetaData({
                singleGroupNode: false,
            });
            expect(getCollection().at(0).isHiddenGroup()).toBe(false);
        });

        // При инциализации списка с единственной группой, singleGroupNode = true, groupNodeVisibility = visible
        // группу надо отобразить
        it('group should not be hidden, +groupNodeVisibility=visible, +singleGroupNode=true', () => {
            recordSet.setMetaData({
                singleGroupNode: true,
            });
            const collection = getCollection({
                groupNodeVisibility: 'visible',
                collection: recordSet,
            });
            expect(collection.at(0).isHiddenGroup()).toBe(false);
        });

        // При инциализации списка с единственной группой, singleGroupNode = false, groupNodeVisibility = hasdata
        // группу надо отобразить
        it('group should not be hidden, +groupNodeVisibility=hasdata, +singleGroupNode=false', () => {
            recordSet.setMetaData({
                singleGroupNode: false,
            });
            const collection = getCollection({
                groupNodeVisibility: 'hasdata',
                collection: recordSet,
            });
            expect(collection.at(0).isHiddenGroup()).toBe(false);
        });

        // При инциализации списка с единственной группой, singleGroupNode = true, groupNodeVisibility = hasdata
        // группу надо скрыть
        it('group should be hidden, +groupNodeVisibility=hasdata, +singleGroupNode=true', () => {
            recordSet.setMetaData({
                singleGroupNode: true,
            });
            const collection = getCollection({
                groupNodeVisibility: 'hasdata',
                collection: recordSet,
            });
            expect(collection.at(0).isHiddenGroup()).toBe(true);
        });
    });

    // проверяем установку CSS классов для единственной группы
    it('getItemClasses', () => {
        recordSet.setMetaData({
            singleGroupNode: true,
        });
        const collection = getCollection({
            groupNodeVisibility: 'hasdata',
            collection: recordSet,
        });
        const itemClasses = collection.at(0).getItemClasses({
            style: 'default',
        });
        CssClassesAssert.include(itemClasses, 'controls-ListView__groupHidden');
        CssClassesAssert.notInclude(itemClasses, [
            'controls-ListView__group',
            'controls-ListView__group',
            'controls-Grid__row',
            'controls-Grid__row_default',
        ]);
    });

    describe('_updateGroupNodeVisibility', () => {
        // Делаем сброс данных c единственной группой на новые с единственной группой. Группа должна быть скрыта
        it('reset in RecordSet, should set isHiddenGroup = true', () => {
            const collection = getCollection();
            const cloneRecordSet = recordSet.clone();

            const item = collection.at(0);
            expect(item.isHiddenGroup()).toBe(true);

            recordSet.assign(cloneRecordSet);
            recordSet.setMetaData({
                singleGroupNode: true,
            });
            const newitem = collection.at(0);

            // проверим, что новая группа скрыта, но это не та же самая запись
            expect(newitem.isHiddenGroup()).toBe(true);
            expect(item).not.toEqual(newitem);
        });

        // Делаем добавление в конец рекордсета, не должно быть ни одной скрытой группы
        it('add to RecordSet after last item, should set isHiddenGroup = false', () => {
            const collection = getCollection();
            const record = new Model({
                keyProperty: 'key',
                rawData: {
                    key: 3,
                    parent: null,
                    type: true,
                    nodeType: 'group',
                },
            });

            expect(collection.at(0).isHiddenGroup()).toBe(true);

            recordSet.setMetaData({
                singleGroupNode: false,
            });
            recordSet.add(record, 2);

            // проверим, что ни одна группа не скрыта
            expect(collection.at(0).isHiddenGroup()).toBe(false);
            expect(collection.at(2).isHiddenGroup()).toBe(false);
        });

        // Делаем добавление в начало рекордсета, не должно быть ни одной скрытой группы
        it('add to RecordSet before first item, should set isHiddenGroup = false', () => {
            const collection = getCollection();
            const record = new Model({
                keyProperty: 'key',
                rawData: {
                    key: 3,
                    parent: null,
                    type: true,
                    nodeType: 'group',
                },
            });

            expect(collection.at(0).isHiddenGroup()).toBe(true);

            recordSet.setMetaData({
                singleGroupNode: false,
            });
            recordSet.add(record, 0);

            // проверим, что ни одна группа не скрыта
            expect(collection.at(0).isHiddenGroup()).toBe(false);
            expect(collection.at(1).isHiddenGroup()).toBe(false);
        });

        it('remove from RecordSet, changed singleGroupNode false to true, should set isHiddenGroup = true', () => {
            recordSet = new RecordSet({
                rawData: [
                    {
                        key: 1,
                        parent: null,
                        type: true,
                        nodeType: 'group',
                    },
                    {
                        key: 2,
                        parent: 1,
                        type: null,
                        nodeType: null,
                    },
                    {
                        key: 3,
                        parent: null,
                        type: true,
                        nodeType: 'group',
                    },
                ],
                keyProperty: 'key',
            });
            recordSet.setMetaData({
                singleGroupNode: false,
            });
            const collection = getCollection();
            expect(collection.at(0).isHiddenGroup()).toBe(false);

            recordSet.setMetaData({
                singleGroupNode: true,
            });
            recordSet.removeAt(2);

            expect(collection.at(0).isHiddenGroup()).toBe(true);
        });

        // Пересчитываем видимость узлов когда меняется только groupNodeVisibility.
        it('change nodeTypeProperty, should set isHiddenGroup = true and change version', () => {
            recordSet.setMetaData({
                singleGroupNode: true,
            });
            const collection = getCollection({
                groupNodeVisibility: 'hasdata',
                collection: recordSet,
            });
            const item = collection.at(0);
            expect(item.isHiddenGroup()).toBe(true);

            collection.setGroupNodeVisibility('visible');

            expect(item.isHiddenGroup()).toBe(false);
        });

        // Меняем видимость групп при append.
        it('append ещ КусщквЫуе, should set isHiddenGroup = false', () => {
            recordSet.setMetaData({
                singleGroupNode: true,
            });
            const collection = getCollection({
                groupNodeVisibility: 'hasdata',
                collection: recordSet,
            });
            expect(collection.at(0).isHiddenGroup()).toBe(true);

            const newItems = new RecordSet({
                rawData: [
                    {
                        id: 3,
                        nodeType: 'group',
                        parent: null,
                        node: true,
                        hasChildren: false,
                    },
                    {
                        id: 4,
                        parent: 3,
                        node: null,
                    },
                ],
            });

            recordSet.setMetaData({
                singleGroupNode: false,
            });
            recordSet.append(newItems);

            expect(collection.at(0).isHiddenGroup()).toBe(false);
        });

        // Пересчитываем видимость узлов когда меняется только NodeTypeProperty
        it('change nodeTypeProperty', () => {
            recordSet.setMetaData({
                singleGroupNode: true,
            });
            const collection = getCollection({
                groupNodeVisibility: 'hasdata',
                collection: recordSet,
            });
            expect(collection.at(0).isHiddenGroup()).toBe(true);
            collection.setNodeTypeProperty('newNodeType');
            expect(collection.at(0).isHiddenGroup()).toBe(false);
        });
    });
});
