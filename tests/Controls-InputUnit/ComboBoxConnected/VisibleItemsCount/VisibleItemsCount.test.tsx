/**
 * @jest-environment jsdom
 */

import { getContent } from 'Controls-InputUnit/resources/utils';
import { WasabyEvents } from 'UICore/Events';
import { unmountComponentAtNode } from 'react-dom';
import { render } from '@testing-library/react';
import { default as VisibleItemsCount } from 'Controls-Input-demo/ComboboxConnected/VisibleItemsCount';

describe('Controls-Input/ComboBoxGroupConnected/VisibleItemsCount', () => {
    setTestID(152174983);
    let container = null;

    beforeEach(() => {
        jest.useFakeTimers('modern');
        jest.setSystemTime(new Date(1996, 5, 21));
        container = document.createElement('div');
        WasabyEvents.initInstance(container);
        document.body.appendChild(container);
    });
    afterEach(() => {
        unmountComponentAtNode(container);
        WasabyEvents.destroyInstance(container);
        jest.useRealTimers();
        container.remove();
        container = null;
    });

    it('VisibleItemsCount', async () => {
        render(getContent(VisibleItemsCount), { container });
        expect(container).toMatchSnapshot();
    });
});
