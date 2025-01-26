/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { render } from '@testing-library/react';
import { WasabyEvents } from 'UICore/Events';
import { getAbstractListComponent } from 'Controls-Lists/abstractList';
import { DataContext } from 'Controls-DataEnv/context';

const STORE_ID = 'test_store';
const INCORRECT_STORE_ID = 'incorrect_test_store_id';

const STORE_VALUE = {
    dataFactoryName: 'Controls/dataFactory:List',
    dataFactoryArguments: {},
};

const CONTEXT_VALUE = { [STORE_ID]: STORE_VALUE };

const INCORRECT_STORE_ID_ERROR = Error(
    `В конексте данных отсутствует слайс с идентификатором - ${INCORRECT_STORE_ID}`
);

describe('Controls-ListsUnit/AbstractList/getAbstractListComponent', () => {
    let container: HTMLDivElement;

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

    it('AbstractList throws an error on invalid store id', () => {
        const componentProps = {
            storeId: INCORRECT_STORE_ID,
        };

        const Component = getAbstractListComponent(() => <div />);

        expect(() => {
            render(
                <DataContext.Provider value={CONTEXT_VALUE}>
                    <Component {...componentProps} />
                </DataContext.Provider>,
                {
                    container,
                }
            );
        }).toThrow(INCORRECT_STORE_ID_ERROR);
    });
});
