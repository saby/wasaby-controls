import { IColumn } from 'Controls/grid';
import { IData } from '../Interface';

export const Events = {
    getColumns: (): IColumn[] => {
        return [
            {
                displayProperty: 'title',
                width: '',
            },
        ];
    },
    getDataBeforeExpanded: (): IData[] => {
        return [
            {
                key: 1,
                title: 'Асинхронная обработка перед разворотом узла',
                parent: null,
                nodeType: true,
            },
            { key: 11, title: 'Лист 1-1', parent: 1, nodeType: null },
            { key: 12, title: 'Лист 1-2', parent: 1, nodeType: null },
            {
                key: 2,
                title: 'Асинхронная обработка перед разворотом узла',
                parent: null,
                nodeType: true,
            },
            { key: 21, title: 'Лист 2-1', parent: 2, nodeType: null },
            { key: 22, title: 'Лист 2-2', parent: 2, nodeType: null },
        ];
    },
    getDataBeforeCollapsed: (): IData[] => {
        return [
            {
                key: 1,
                title: 'Асинхронная обработка перед сворачиванием узла',
                parent: null,
                nodeType: true,
            },
            { key: 11, title: 'Лист 1-1', parent: 1, nodeType: null },
            { key: 12, title: 'Лист 1-2', parent: 1, nodeType: null },
            {
                key: 2,
                title: 'Асинхронная обработка перед сворачиванием узла',
                parent: null,
                nodeType: true,
            },
            { key: 21, title: 'Лист 2-1', parent: 2, nodeType: null },
            { key: 22, title: 'Лист 2-2', parent: 2, nodeType: null },
        ];
    },
    getDataCollapsedItemsChanged: (): IData[] => {
        return [
            {
                key: 1,
                title: 'Этот узел нельзя свернуть',
                parent: null,
                nodeType: true,
            },
            { key: 11, title: 'Лист 1-1', parent: 1, nodeType: null },
            { key: 12, title: 'Лист 1-2', parent: 1, nodeType: null },
            {
                key: 2,
                title: 'Этот узел можно свернуть',
                parent: null,
                nodeType: true,
            },
            { key: 21, title: 'Лист 2-1', parent: 2, nodeType: null },
            { key: 22, title: 'Лист 2-2', parent: 2, nodeType: null },
        ];
    },
    getDataExpandedItemsChanged: (): IData[] => {
        return [
            {
                key: 1,
                title: 'Этот узел нельзя развернуть',
                parent: null,
                nodeType: true,
            },
            { key: 11, title: 'Лист 1-1', parent: 1, nodeType: null },
            { key: 12, title: 'Лист 1-2', parent: 1, nodeType: null },
            {
                key: 2,
                title: 'Этот узел можно развернуть',
                parent: null,
                nodeType: true,
            },
            { key: 21, title: 'Лист 2-1', parent: 2, nodeType: null },
            { key: 22, title: 'Лист 2-2', parent: 2, nodeType: null },
        ];
    },
};
