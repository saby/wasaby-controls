/**
 * @jest-environment jsdom
 */

import { getContent } from 'Controls-InputUnit/resources/utils';
import { WasabyEvents } from 'UICore/Events';
import { unmountComponentAtNode } from 'react-dom';
import { render } from '@testing-library/react';
import { default as Variants } from 'Controls-Input-demo/ComboboxConnected/Variants';

describe('Controls-Input/ComboBoxGroupConnected/Variants', () => {
    setTestID(152174975);
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

    it('Variants', async () => {
        render(getContent(Variants), { container });
        expect(container).toMatchSnapshot();
    });
});
