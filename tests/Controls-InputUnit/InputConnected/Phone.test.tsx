/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { WasabyEvents } from 'UICore/Events';
import { render } from '@testing-library/react';
import { getContent } from '../resources/utils';
import { default as DefaultValue } from 'Controls-Input-demo/InputConnected/Phone/DefaultValue';
import { default as FlagPosition } from 'Controls-Input-demo/InputConnected/Phone/FlagPosition';
import { default as FlagVisible } from 'Controls-Input-demo/InputConnected/Phone/FlagVisible';
import { default as Label } from 'Controls-Input-demo/InputConnected/Phone/Label';
import { default as OnlyMobile } from 'Controls-Input-demo/InputConnected/Phone/OnlyMobile';

describe('Controls-Input/InputConnected:Phone', () => {
    setTestID(148321624);

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
        render(getContent(DefaultValue), { container });
        expect(container).toMatchSnapshot();
    });
    it('FlagPosition', async () => {
        render(getContent(FlagPosition), { container });
        expect(container).toMatchSnapshot();
    });
    it('FlagVisible', async () => {
        render(getContent(FlagVisible), { container });
        expect(container).toMatchSnapshot();
    });
    it('label', async () => {
        render(getContent(Label), { container });
        expect(container).toMatchSnapshot();
    });
    it('OnlyMobile', async () => {
        render(getContent(OnlyMobile), { container });
        expect(container).toMatchSnapshot();
    });
});
