/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { WasabyEvents } from 'UICore/Events';
import { render } from '@testing-library/react';
import { getContent } from '../resources/utils';
import { default as Index } from 'Controls-Input-demo/DecoratorConnected/Number/Index';

describe(
    'Controls-Input/decoratorConnected:Number',
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
    }
);
