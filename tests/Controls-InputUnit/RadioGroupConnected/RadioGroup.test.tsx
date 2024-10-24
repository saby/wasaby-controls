/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { WasabyEvents } from 'UICore/Events';
import { render } from '@testing-library/react';
import { getContent } from '../resources/utils';
import { default as Direction } from 'Controls-Input-demo/RadioGroupConnected/Direction';
import { default as Variants } from 'Controls-Input-demo/RadioGroupConnected/Variants';
import { default as WrapText } from 'Controls-Input-demo/RadioGroupConnected/WrapText';
import { default as Label } from 'Controls-Input-demo/RadioGroupConnected/Label';

describe(
    'Controls-Input/RadioGroupConnected',
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

        it('Variants', async () => {
            render(getContent(Variants), {container});
            expect(container).toMatchSnapshot();
        });
        it('Direction', async () => {
            render(getContent(Direction), {container});
            expect(container).toMatchSnapshot();
        });
        it('WrapText', async () => {
            render(getContent(WrapText), {container});
            expect(container).toMatchSnapshot();
        });
        it('label', async () => {
            render(getContent(Label), {container});
            expect(container).toMatchSnapshot();
        });
    }
);
