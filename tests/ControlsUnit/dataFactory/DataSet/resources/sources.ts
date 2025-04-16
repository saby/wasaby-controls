import {
    Memory,
    IMemoryOptions,
    HierarchicalMemory,
    IHierarchicalMemoryOptions,
} from 'Types/source';

export const items = [
    {
        key: 0,
        title: 'Саша',
    },
    {
        key: 1,
        title: 'Дима',
    },
    {
        key: 2,
        title: 'Алексей',
    },
    {
        key: 3,
        title: 'Сергей',
    },
];

export const hierarchyItems = [
    {
        key: 0,
        title: 'Контролы',
        parent: null,
        hasChildren: true,
    },
    {
        key: 1,
        title: 'Саша',
        parent: 0,
        hasChildren: false,
    },
    {
        key: 2,
        title: 'Дмитрий',
        parent: 0,
        hasChildren: false,
    },
    {
        key: 3,
        title: 'Каталог',
        parent: null,
        hasChildren: true,
    },
    {
        key: 4,
        title: 'Алексей',
        parent: 3,
        hasChildren: false,
    },
    {
        key: 5,
        title: 'Сергей',
        parent: null,
        hasChildren: false,
    },
];

export function getMemory(options?: Partial<IMemoryOptions>): Memory {
    return new Memory({
        data: items,
        keyProperty: 'key',
        ...options,
    });
}

export function getHierarchicalMemory(
    options?: Partial<IHierarchicalMemoryOptions>
): HierarchicalMemory {
    return new HierarchicalMemory({
        data: hierarchyItems,
        keyProperty: 'key',
        parentProperty: 'parent',
        ...options,
    });
}
