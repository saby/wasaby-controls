/**
 * @jest-environment jsdom
 */

import { Component } from 'Controls-Lists/treeGrid';

const UNNEEDED_TREE_GRID_LOADED_ERROR = Error('UNNEEDED_TREE_GRID_LOADED_ERROR');

jest.mock('Controls/treeGrid', () => {
    throw UNNEEDED_TREE_GRID_LOADED_ERROR;
});

jest.mock('Controls/grid', () => {
    throw UNNEEDED_TREE_GRID_LOADED_ERROR;
});

import { HierarchicalMemory as Source } from 'Types/source';
import { unmountComponentAtNode } from 'react-dom';
import { WasabyEvents } from 'UICore/Events';
import { render } from '@testing-library/react';

import { DataContext } from 'Controls-DataEnv/context';
import { isLoaded } from 'WasabyLoader/ModulesLoader';

const STORE_ID = 'test_store';

const STORE_VALUE = {
    dataFactoryName: 'Controls/dataFactory:List',
    dataFactoryArguments: {
        displayProperty: 'title',
        source: new Source({
            keyProperty: 'key',
            data: [
                {
                    key: 1,
                    title: 'Audi',
                    country: 'Германия',
                    founded: '1909',
                    parent: null,
                    type: true,
                    hasChild: true,
                },
            ],
            parentProperty: 'parent',
        }),
        navigation: {
            source: 'page',
            view: 'demand',
            sourceConfig: {
                pageSize: 10,
                page: 0,
                hasMore: false,
            },
        },
        keyProperty: 'key',
        parentProperty: 'parent',
        nodeProperty: 'type',
        columns: [
            {
                displayProperty: 'title',
                width: '',
            },
        ],

        markerVisibility: 'visible',
        multiSelectVisibility: 'visible',
        collectionType: 'TreeGrid',
    },
};

const CONTEXT_VALUE = { [STORE_ID]: STORE_VALUE };

describe('Controls-ListsUnit/treeGrid/Component', () => {
    let container = null;

    beforeEach(() => {
        container = document.createElement('div');
        WasabyEvents.initInstance(container);
        document.body.appendChild(container);
    });

    afterEach(() => {
        unmountComponentAtNode(container);
        WasabyEvents.destroyInstance(container);
        container.remove();
        container = null;
    });

    test('TreeGrid dependencies', () => {
        const componentProps = {
            storeId: STORE_ID,
        };

        expect(() => {
            render(
                <DataContext.Provider value={CONTEXT_VALUE}>
                    <Component {...componentProps} />
                </DataContext.Provider>,
                {
                    container,
                }
            );
        }).not.toThrow(UNNEEDED_TREE_GRID_LOADED_ERROR);

        expect(isLoaded('Controls/treeGrid')).toBe(false);
        expect(isLoaded('Controls/grid')).toBe(false);
    });
});
