import { TGroupNodeViewMode, TreeGridCollection } from 'Controls/treeGrid';
import { RecordSet } from 'Types/collection';
import { CssClassesAssert } from 'ControlsUnit/CustomAsserts';
import { Model } from 'Types/entity';

describe('Controls/treeGrid/display/NodeTypeProperty/TreeGridGroupDataRow/IsHiddenGroup', () => {
    let oneEmptyGroup: RecordSet;
    let oneNotEmptyGroup: RecordSet;
    let severalGroupsWithFirstNotEmpty: RecordSet;

    function getCollection(options?: {
        collection?: RecordSet;
        groupNodeViewMode?: TGroupNodeViewMode;
    }): TreeGridCollection<any> {
        return new TreeGridCollection({
            collection: options?.collection,
            groupNodeViewMode: options?.groupNodeViewMode,
            keyProperty: 'key',
            parentProperty: 'parent',
            nodeProperty: 'type',
            nodeTypeProperty: 'nodeType',
            expandedItems: [null],
            root: null,
            columns: [{}],
        });
    }

    beforeEach(() => {
        oneEmptyGroup = new RecordSet({
            rawData: [
                {
                    key: 1,
                    parent: null,
                    type: true,
                    nodeType: 'group',
                },
            ],
            keyProperty: 'key',
        });

        oneNotEmptyGroup = new RecordSet({
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

        severalGroupsWithFirstNotEmpty = new RecordSet({
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
                {
                    key: 4,
                    parent: 3,
                    type: null,
                    nodeType: null,
                },
            ],
            keyProperty: 'key',
        });
    });

    describe('constructor', () => {
        it('the only group and empty in default mode', () => {
            const collection = getCollection({
                groupNodeViewMode: 'default',
                collection: oneEmptyGroup,
            });
            expect(collection.at(0).isHiddenGroup()).toBe(true);
        });

        it('the only group and not empty in default mode', () => {
            const collection = getCollection({
                groupNodeViewMode: 'default',
                collection: oneNotEmptyGroup,
            });
            expect(collection.at(0).isHiddenGroup()).toBe(false);
        });

        it('the only group and not empty in headerless mode', () => {
            const collection = getCollection({
                groupNodeViewMode: 'headerless',
                collection: oneNotEmptyGroup,
            });
            expect(collection.at(0).isHiddenGroup()).toBe(true);
        });
        it('two groups with first not empty in headerless mode', () => {
            const collection = getCollection({
                groupNodeViewMode: 'headerless',
                collection: severalGroupsWithFirstNotEmpty,
            });
            expect(collection.at(0).isHiddenGroup()).toBe(true);
            expect(collection.at(2).isHiddenGroup()).toBe(false);
        });
        // проверяем установку CSS классов для единственной группы в режиме headerless
        it('getItemClasses', () => {
            const collection = getCollection({
                groupNodeViewMode: 'headerless',
                collection: oneNotEmptyGroup,
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
                const collection = getCollection({
                    groupNodeViewMode: 'headerless',
                    collection: oneNotEmptyGroup,
                });
                const cloneRecordSet = oneNotEmptyGroup.clone();

                const item = collection.at(0);
                expect(item.isHiddenGroup()).toBe(true);

                oneNotEmptyGroup.assign(cloneRecordSet);
                const newitem = collection.at(0);

                // проверим, что новая группа скрыта, но это не та же самая запись
                expect(newitem.isHiddenGroup()).toBe(true);
                expect(item).not.toEqual(newitem);
            });

            // Добавляем пустую группу к единственной непустой группе. Все заголовки групп скрыты
            it('add to empty group to the only non empty group in headerless mode', () => {
                const collection = getCollection({
                    groupNodeViewMode: 'headerless',
                    collection: oneNotEmptyGroup,
                });
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
                const clone = oneNotEmptyGroup.clone();
                clone.add(record, 2);
                oneNotEmptyGroup.assign(clone);

                // проверим, что обе группы скрыты
                expect(collection.at(0).isHiddenGroup()).toBe(true);
                expect(collection.at(2).isHiddenGroup()).toBe(true);
            });

            // Добавляем непустую группу перед единственной непустой.
            it('add non empty group before non empty group in headerless mode', () => {
                const collectionMain = getCollection({
                    groupNodeViewMode: 'headerless',
                    collection: oneNotEmptyGroup,
                });

                expect(collectionMain.at(0).isHiddenGroup()).toBe(true);

                const newItems = new RecordSet({
                    rawData: [
                        {
                            key: 3,
                            nodeType: 'group',
                            parent: null,
                            type: true,
                            hasChildren: true,
                        },
                        {
                            key: 4,
                            parent: 3,
                            type: null,
                            nodeType: null,
                        },
                    ],
                });

                const clone = oneNotEmptyGroup.clone();

                clone.prepend(newItems);
                oneNotEmptyGroup.assign(clone);

                // проверим, что поменялась скрытая группа
                expect(collectionMain.at(0).isHiddenGroup()).toBe(true);
                expect(collectionMain.at(2).isHiddenGroup()).toBe(false);
            });

            // Пересчитываем видимость узлов когда меняется только groupNodeViewMode
            it('change groupNodeViewMode', () => {
                const collection = getCollection({
                    groupNodeViewMode: 'default',
                    collection: severalGroupsWithFirstNotEmpty,
                });
                const item = collection.at(0);
                expect(item.isHiddenGroup()).toBe(false);

                collection.setGroupNodeViewMode('headerless');

                expect(item.isHiddenGroup()).toBe(true);
            });
        });
    });
});
