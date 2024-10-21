/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { WasabyEvents } from 'UICore/Events';
import { render } from '@testing-library/react';
import { getContent } from '../resources/utils';
import { default as DefaultValue } from 'Controls-Input-demo/InputConnected/Number/DefaultValue';
import { default as Label } from 'Controls-Input-demo/InputConnected/Number/Label';
import { default as IntegersLength } from 'Controls-Input-demo/InputConnected/Number/IntegersLength';
import { default as OnlyPositive } from 'Controls-Input-demo/InputConnected/Number/OnlyPositive';
import { default as Precision } from 'Controls-Input-demo/InputConnected/Number/Precision';
import { default as UseGrouping } from 'Controls-Input-demo/InputConnected/Number/UseGrouping';

describe(
    'Controls-Input/InputConnected:Number',
    () => {
        setTestID(148321529);

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
        it('Precision', async () => {
            render(getContent(Precision), {container});
            expect(container).toMatchSnapshot();
        });
        it('UseGrouping', async () => {
            render(getContent(UseGrouping), {container});
            expect(container).toMatchSnapshot();
        });
    }
);
