/**
 * @jest-environment jsdom
 */

import { getContent } from 'Controls-InputUnit/resources/utils';
import { WasabyEvents } from 'UICore/Events';
import { unmountComponentAtNode } from 'react-dom';
import { render } from '@testing-library/react';
import { default as MultiSelect } from 'Controls-Input-demo/ComboboxConnected/MultiSelect';

describe('Controls-Input/ComboBoxGroupConnected/MultiSelect', () => {
    setTestID(152174963);
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

    it('MultiSelect', async () => {
        render(getContent(MultiSelect), { container });
        expect(container).toMatchSnapshot();
    });
});
