import { ObjectType, NumberType } from 'Meta/types';
import * as ModulesLoader from 'WasabyLoader/ModulesLoader';
import { getGroupsFromMeta } from 'Controls-editors/_object-type/utils/getGroupsFromMeta';
import { ObjectTypeFactory } from 'Controls-editors/_object-type/factory/Factory';

describe('Controls-editors/propertyGrid Виджет с стилевыми свойствами', () => {
    it('На типе заданы дефолтные значения на свойстве prop1 и на всем типе. Результат: после обработки на двух свойствах есть дефолтные значения', () => {
        const metaType = ObjectType.properties({
            prop1: NumberType.defaultValue(1).order(1).id('type1'),
            prop2: NumberType.order(2).id('type2'),
        }).defaultValue({
            prop2: 2,
        });

        const getEditorMock = jest.fn(() => {
            return {
                Component: 'test',
            };
        });

        jest.spyOn(Math, 'random').mockReturnValue(0);

        const groups = getGroupsFromMeta(metaType, getEditorMock);

        expect(JSON.parse(JSON.stringify(groups))).toEqual([
            {
                editors: [
                    {
                        Component: 'test',
                        defaultValue: 1,
                        editorProps: undefined,
                        metaType: {
                            $serialized$: 'inst',
                            id: 'type1',
                            module: 'Meta/types:Meta',
                            state: [
                                {
                                    defaultValue: '1',
                                    id: 'type1',
                                    inherits: ['number'],
                                    is: 'primitive',
                                    order: 1,
                                    required: true,
                                },
                            ],
                        },
                        name: 'prop1',
                    },
                    {
                        Component: 'test',
                        defaultValue: 2,
                        editorProps: undefined,
                        metaType: {
                            $serialized$: 'inst',
                            id: 'type2',
                            module: 'Meta/types:Meta',
                            state: [
                                {
                                    id: 'type2',
                                    inherits: ['number'],
                                    is: 'primitive',
                                    order: 2,
                                    required: true,
                                },
                            ],
                        },
                        name: 'prop2',
                    },
                ],
                id: undefined,
                title: undefined,
            },
        ]);
    });

    it('На типе заданы свойства редакторов. Результат: после обработки на двух свойствах есть свойства редакторов', async () => {
        const metaType = ObjectType.properties({
            prop1: NumberType.defaultValue(1).order(1).id('type1').editorProps({
                editProp1: 1,
            }),
            prop2: NumberType.order(2).id('type2').editorProps({
                editProp2: 2,
            }),
        }).defaultValue({
            prop2: 2,
        });

        const loadedData = await ObjectTypeFactory.loadData({
            metaType,
        });

        const slice = new ObjectTypeFactory.slice({
            loadResult: loadedData,
        });

        jest.spyOn(Math, 'random').mockReturnValue(0);

        const groups = getGroupsFromMeta(metaType, slice.getEditor);

        expect(JSON.parse(JSON.stringify(groups))).toEqual([
            {
                editors: [
                    {
                        Component: 'Controls-editors/input:NumberEditor',
                        defaultValue: 1,
                        editorProps: {
                            editProp1: 1,
                        },
                        metaType: {
                            $serialized$: 'inst',
                            id: 'type1',
                            module: 'Meta/types:Meta',
                            state: [
                                {
                                    defaultValue: '1',
                                    id: 'type1',
                                    inherits: ['number'],
                                    is: 'primitive',
                                    order: 1,
                                    required: true,
                                },
                            ],
                        },
                        name: 'prop1',
                    },
                    {
                        Component: 'Controls-editors/input:NumberEditor',
                        defaultValue: 2,
                        editorProps: {
                            editProp2: 2,
                        },
                        metaType: {
                            $serialized$: 'inst',
                            id: 'type2',
                            module: 'Meta/types:Meta',
                            state: [
                                {
                                    id: 'type2',
                                    inherits: ['number'],
                                    is: 'primitive',
                                    order: 2,
                                    required: true,
                                },
                            ],
                        },
                        name: 'prop2',
                    },
                ],
                id: undefined,
                title: undefined,
            },
        ]);
    });

    it(
        'В аргументах фабрики для типа задан редактор с переопределенным свойствам. ' +
            'Результат: после обработки на свойстве задан переопределенный редактор и свойства',
        async () => {
            const metaType = ObjectType.properties({
                prop1: NumberType.order(1).id('type1'),
                prop2: NumberType.order(2).id('type2'),
            });

            const loadedData = await ObjectTypeFactory.loadData({
                metaType,
                overridenEditors: {
                    type1: {
                        editor: 'TestEditor',
                        editorProps: {
                            testEditorProp1: 1,
                        },
                    },
                },
            });

            jest.spyOn(ModulesLoader, 'loadAsync').mockReturnValue(Promise.resolve(null));

            const slice = new ObjectTypeFactory.slice({
                loadResult: loadedData,
            });

            jest.spyOn(Math, 'random').mockReturnValue(0);

            const groups = getGroupsFromMeta(metaType, slice.getEditor);

            expect(JSON.parse(JSON.stringify(groups))).toEqual([
                {
                    editors: [
                        {
                            Component: 'TestEditor',
                            editorProps: {
                                testEditorProp1: 1,
                            },
                            metaType: {
                                $serialized$: 'inst',
                                id: 'type1',
                                module: 'Meta/types:Meta',
                                state: [
                                    {
                                        id: 'type1',
                                        inherits: ['number'],
                                        is: 'primitive',
                                        order: 1,
                                        required: true,
                                    },
                                ],
                            },
                            name: 'prop1',
                        },
                        {
                            Component: 'Controls-editors/input:NumberEditor',
                            metaType: {
                                $serialized$: 'inst',
                                id: 'type2',
                                module: 'Meta/types:Meta',
                                state: [
                                    {
                                        id: 'type2',
                                        inherits: ['number'],
                                        is: 'primitive',
                                        order: 2,
                                        required: true,
                                    },
                                ],
                            },
                            name: 'prop2',
                        },
                    ],
                    id: undefined,
                    title: undefined,
                },
            ]);
        }
    );

    it(
        'В аргументах фабрики для типа заданы переопределенные свойства для базового редактора. ' +
            'Результат: после обработки на свойстве задан переопределенный редактор и свойства',
        async () => {
            const metaType = ObjectType.properties({
                prop1: NumberType.order(1).id('type1'),
                prop2: NumberType.order(2).id('type2'),
            });

            const loadedData = await ObjectTypeFactory.loadData({
                metaType,
                overridenEditors: {
                    type1: {
                        editorProps: {
                            testEditorProp1: 1,
                        },
                    },
                },
            });

            jest.spyOn(ModulesLoader, 'loadAsync').mockReturnValue(Promise.resolve(null));

            const slice = new ObjectTypeFactory.slice({
                loadResult: loadedData,
            });

            jest.spyOn(Math, 'random').mockReturnValue(0);

            const groups = getGroupsFromMeta(metaType, slice.getEditor);

            expect(JSON.parse(JSON.stringify(groups))).toEqual([
                {
                    editors: [
                        {
                            Component: 'Controls-editors/input:NumberEditor',
                            editorProps: {
                                testEditorProp1: 1,
                            },
                            metaType: {
                                $serialized$: 'inst',
                                id: 'type1',
                                module: 'Meta/types:Meta',
                                state: [
                                    {
                                        id: 'type1',
                                        inherits: ['number'],
                                        is: 'primitive',
                                        order: 1,
                                        required: true,
                                    },
                                ],
                            },
                            name: 'prop1',
                        },
                        {
                            Component: 'Controls-editors/input:NumberEditor',
                            metaType: {
                                $serialized$: 'inst',
                                id: 'type2',
                                module: 'Meta/types:Meta',
                                state: [
                                    {
                                        id: 'type2',
                                        inherits: ['number'],
                                        is: 'primitive',
                                        order: 2,
                                        required: true,
                                    },
                                ],
                            },
                            name: 'prop2',
                        },
                    ],
                    id: undefined,
                    title: undefined,
                },
            ]);
        }
    );

    it(
        'Ни типе указан редактор для свойств prop1, prop2. ' +
            'Результат: после обработки в группе два редактора, в первом два свойства',
        async () => {
            const metaType = ObjectType.properties({
                prop1: NumberType.order(1).id('type1').defaultValue(1),
                prop2: NumberType.order(2).id('type2'),
                prop3: NumberType.order(3).id('type3'),
            })
                .complexEditors([
                    {
                        name: 'ComplexEditor',
                        properties: ['prop1', 'prop2'],
                    },
                ])
                .defaultValue({
                    prop2: 2,
                });

            const loadedData = await ObjectTypeFactory.loadData({
                metaType,
            });

            jest.spyOn(ModulesLoader, 'loadAsync').mockReturnValue(Promise.resolve(null));

            const slice = new ObjectTypeFactory.slice({
                loadResult: loadedData,
            });

            jest.spyOn(Math, 'random').mockReturnValue(0);

            const groups = getGroupsFromMeta(metaType, slice.getEditor);

            expect(groups.length).toEqual(1);
            expect(groups[0].editors.length).toEqual(2);

            expect(JSON.parse(JSON.stringify(groups))).toEqual([
                {
                    editors: [
                        {
                            Component: 'ComplexEditor',
                            attributes: {
                                prop1: {
                                    $serialized$: 'inst',
                                    id: 'type1',
                                    module: 'Meta/types:Meta',
                                    state: [
                                        {
                                            defaultValue: '1',
                                            id: 'type1',
                                            inherits: ['number'],
                                            is: 'primitive',
                                            order: 1,
                                            required: true,
                                        },
                                    ],
                                },
                                prop2: {
                                    $serialized$: 'inst',
                                    id: 'type2',
                                    module: 'Meta/types:Meta',
                                    state: [
                                        {
                                            id: 'type2',
                                            inherits: ['number'],
                                            is: 'primitive',
                                            order: 2,
                                            required: true,
                                        },
                                    ],
                                },
                            },
                            defaultValue: {
                                prop1: 1,
                                prop2: 2,
                            },
                        },
                        {
                            Component: 'Controls-editors/input:NumberEditor',
                            metaType: {
                                $serialized$: 'inst',
                                id: 'type3',
                                module: 'Meta/types:Meta',
                                state: [
                                    {
                                        id: 'type3',
                                        inherits: ['number'],
                                        is: 'primitive',
                                        order: 3,
                                        required: true,
                                    },
                                ],
                            },
                            name: 'prop3',
                        },
                    ],
                },
            ]);
        }
    );
});
