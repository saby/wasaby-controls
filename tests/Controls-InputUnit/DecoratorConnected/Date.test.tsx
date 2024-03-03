/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { WasabyEvents } from 'UICore/Events';
import { render } from '@testing-library/react';
import { getContent } from '../resources/utils';
import { default as Index } from 'Controls-Input-demo/DecoratorConnected/Date/Index';
import { default as Mask } from 'Controls-Input-demo/DecoratorConnected/Date/Mask';

describe(
    'Controls-Input/decoratorConnected:Date',
    () => {
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

        it('Index', async () => {
            render(getContent(Index), {container});
            expect(container).toMatchSnapshot();
        });
        it('Mask', async () => {
            render(getContent(Mask), {container});
            expect(container).toMatchSnapshot();
        });
    }
);
