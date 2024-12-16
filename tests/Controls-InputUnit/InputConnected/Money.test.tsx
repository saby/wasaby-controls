/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { WasabyEvents } from 'UICore/Events';
import { render } from '@testing-library/react';
import { getContent } from '../resources/utils';
import { default as DefaultValue } from 'Controls-Input-demo/InputConnected/Money/DefaultValue';
import { default as Label } from 'Controls-Input-demo/InputConnected/Money/Label';
import { default as IntegersLength } from 'Controls-Input-demo/InputConnected/Money/IntegersLength';
import { default as OnlyPositive } from 'Controls-Input-demo/InputConnected/Money/OnlyPositive';
import { default as UseGrouping } from 'Controls-Input-demo/InputConnected/Money/UseGrouping';

describe(
    'Controls-Input/InputConnected:Money',
    () => {
        setTestID(148321333);

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
        it('IntegersLength', async () => {
            render(getContent(IntegersLength), {container});
            expect(container).toMatchSnapshot();
        });
        it('label', async () => {
            render(getContent(Label), {container});
            expect(container).toMatchSnapshot();
        });
        it('OnlyPositive', async () => {
            render(getContent(OnlyPositive), {container});
            expect(container).toMatchSnapshot();
        });
        it('UseGrouping', async () => {
            render(getContent(UseGrouping), {container});
            expect(container).toMatchSnapshot();
        });
    }
);
