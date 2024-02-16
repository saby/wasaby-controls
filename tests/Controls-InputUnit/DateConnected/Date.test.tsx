/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { WasabyEvents } from 'UICore/Events';
import { render } from '@testing-library/react';
import { getContent } from '../resources/utils';
import { default as DefaultValue } from 'Controls-Input-demo/DateConnected/Date/DefaultValue';
import { default as Base } from 'Controls-Input-demo/DateConnected/Date/Index';
import { default as Label } from 'Controls-Input-demo/DateConnected/Date/Label';
import { Controller } from 'Controls/popupTemplateStrategy';

describe(
    'Controls-Input/DateConnected:Date',
    () => {
        setTestID(148289607);

        let container = null;
        new Controller().init();

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
        it('base', async () => {
            render(getContent(Base), {container});
            expect(container).toMatchSnapshot();
        });
        it('label', async () => {
            render(getContent(Label), {container});
            expect(container).toMatchSnapshot();
        });
    }
);
