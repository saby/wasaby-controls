/**
 * @jest-environment jsdom
 */
import { ItemsView } from 'Controls/grid';
import { unmountComponentAtNode } from 'react-dom';
import { render } from '@testing-library/react';
import { Loader } from 'Controls-DataEnv/dataLoader';
import { Provider } from 'Controls-DataEnv/context';
import { Memory } from 'Types/source';

function EmptyView() {
    return <div data-qa="EmptyView">EMPTY VIEW</div>;
}

function getEmptyView() {
    return [
        {
            endColumn: 4,
            key: 'Empty',
            render: <EmptyView />,
            startColumn: 1,
        },
    ];
}

describe('ControlsUnit/grid_clean/Render/EmptyView', () => {
    let container: HTMLDivElement = null;
    beforeEach(() => {
        container = document.createElement('div');
        container.className += 'container';
        document.body.appendChild(container);
    });

    afterEach(() => {
        unmountComponentAtNode(container);
        container.remove();
        container = null;
    });

    it('Empty view from slice', async () => {
        const configs = {
            ItemsGridStore: {
                dataFactoryName: 'Controls-DataEnv/currentList:factory',
                dataFactoryArguments: {
                    source: new Memory({
                        keyProperty: 'key',
                        data: [],
                    }),
                    columns: [
                        {
                            key: 'name',
                            displayProperty: 'name',
                        },
                        {
                            key: 'country',
                            displayProperty: 'country',
                        },
                    ],
                    keyProperty: 'key',
                },
            },
        };

        const loadResults = await Loader.load(configs);

        render(
            <Provider configs={configs} loadResults={loadResults}>
                <ItemsView storeId={'ItemsGridStore'} emptyView={getEmptyView()} />
            </Provider>,
            { container }
        );

        expect(container.querySelectorAll('[data-qa="EmptyView"]').length).toEqual(1);
    });
});
