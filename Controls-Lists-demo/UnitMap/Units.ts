import {
    createTest,
    createZone,
    buildTestsTree,
    TTest,
} from 'Controls-Lists-demo/UnitMap/buildTests';

const zones = {
    Marker: createZone('Маркер'),
    MultiSelect: createZone('Мультивыбор'),
    PMO: createZone('ПМО'),
    Hierarchy: createZone('Иерархия'),
    Group: createZone('Группировка'),
    Search: createZone('Поиск'),
} as const;

const RAW_TESTS: TTest[] = [
    createTest('Маркер ставится', { id: 1 }, zones.Marker),
    createTest('Стрелка вниз перемещает маркер на следующую строку', { id: 2 }, zones.Marker),
    createTest(
        'Стрелка вниз перемещает маркер на следующий узел этого уровня',
        { id: 3 },
        zones.Marker,
        zones.Hierarchy
    ),
    createTest('Чекбокс ставится', { id: 4 }, zones.MultiSelect),
    createTest(
        'Выделение всех детей выделяет родителя',
        { id: 5 },
        zones.MultiSelect,
        zones.Hierarchy
    ),
    createTest(
        'Выделение всех детей НЕ выделяет родителя, если применен фильтр',
        { id: 6 },
        zones.MultiSelect,
        zones.Hierarchy,
        zones.Search
    ),

    createTest('ПМО открывается по команде API', { id: 7 }, zones.PMO),

    createTest(
        'При открытии ПМО чекбокс ставится на первую запись',
        { id: 8 },
        zones.PMO,
        zones.Marker
    ),
    createTest(
        'При открытии ПМО чекбокс ставится на первую запись, если это не группа',
        { id: 9 },
        zones.PMO,
        zones.Marker,
        zones.Group
    ),
    createTest(
        'При установке чекбокса по клику, ставится маркер',
        { id: 10 },
        zones.MultiSelect,
        zones.Marker
    ),
];

export const TESTS_COUNT = RAW_TESTS.length;

export const TESTS = buildTestsTree(RAW_TESTS);
