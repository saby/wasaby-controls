/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { WasabyEvents } from 'UICore/Events';
import { render } from '@testing-library/react';
import { getContent } from '../resources/utils';
import { default as Constraint } from 'Controls-Input-demo/InputConnected/Text/Constraint';
import { default as DefaultValue } from 'Controls-Input-demo/InputConnected/Text/DefaultValue';
import { default as Label } from 'Controls-Input-demo/InputConnected/Text/Label';
import { default as Length } from 'Controls-Input-demo/InputConnected/Text/Length';
import { default as Multiline } from 'Controls-Input-demo/InputConnected/Text/Multiline';

describe(
    'Controls-Input/InputConnected:Text',
    () => {
        setTestID(148321705);

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

        it('defaultValue', async () => {
            render(getContent(DefaultValue), {container});
            expect(container).toMatchSnapshot();
        });
        it('Constraint', async () => {
            render(getContent(Constraint), {container});
            expect(container).toMatchSnapshot();
        });
        it('label', async () => {
            render(getContent(Label), {container});
            expect(container).toMatchSnapshot();
        });
        it('Length', async () => {
            render(getContent(Length), {container});
            expect(container).toMatchSnapshot();
        });
        it('Multiline', async () => {
            render(getContent(Multiline), {container});
            expect(container).toMatchSnapshot();
        });
    }
);
