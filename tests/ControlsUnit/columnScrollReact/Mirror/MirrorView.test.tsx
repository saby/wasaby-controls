/**
 * @jest-environment jsdom
 */
jest.mock('Controls/_columnScrollReact/Mirror/proxyEventUtil', () => {
    return {
        __esModule: true,
        proxyEvent: () => {},
    };
});

import { loadSync } from 'WasabyLoader/ModulesLoader';
import { unmountComponentAtNode } from 'react-dom';
import { WasabyEvents } from 'UICore/Events';
import { fireEvent, waitFor } from '@testing-library/react';
import { renderAnyComponent } from '../forTestsOnly/helpers';

import MirrorView from 'Controls/_columnScrollReact/Mirror/MirrorView';
import { QA_SELECTORS } from 'Controls/_columnScrollReact/common/data-qa';

describe('ControlsUnit/columnScrollReact/Mirror/MirrorView', () => {
    let container = null;

    beforeEach(() => {
        container = document.createElement('div');
        WasabyEvents.initInstance(container);
        document.body.appendChild(container);
    });

    afterEach(() => {
        unmountComponentAtNode(container);
        WasabyEvents.destroyInstance(container);
        container.remove();
        container = null;
    });

    it('Рендер с разными наборами ширин.', () => {
        [
            {
                viewPortWidth: 600,
                fixedWidth: 200,
                contentWidth: 1000,
            },
            {
                viewPortWidth: 200,
                fixedWidth: 111,
                contentWidth: 986,
            },
        ].forEach((params) => {
            const { asFragment } = renderAnyComponent(<MirrorView {...params} />, { container });
            expect(asFragment()).toMatchSnapshot();
        });
    });

    it('Обработчики из опций вызываются.', async () => {
        const onTouchStart = jest.fn();
        const onScroll = jest.fn();
        const onTouchEnd = jest.fn();

        const { getByQA } = renderAnyComponent(
            <MirrorView
                viewPortWidth={600}
                fixedWidth={200}
                contentWidth={1000}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                onScroll={onScroll}
            />,
            { container }
        );

        const view = getByQA(QA_SELECTORS.MIRROR);

        fireEvent.touchStart(view);
        await waitFor(() => {
            expect(onTouchStart).toBeCalled();
        });

        fireEvent.scroll(view);
        await waitFor(() => {
            expect(onScroll).toBeCalled();
        });

        fireEvent.touchEnd(view);
        await waitFor(() => {
            expect(onTouchEnd).toBeCalled();
        });
    });

    it(
        'Нужно проксировать определенные события через стекло, на контент под ним. ' +
            'Этим занимается утилита proxyEventUtil, проверяем что она зовется.',
        async () => {
            expect.hasAssertions();
            const proxyEventFn = jest.fn();
            const proxyEventUtilModule = loadSync<
                typeof import('Controls/_columnScrollReact/Mirror/proxyEventUtil')
            >('Controls/_columnScrollReact/Mirror/proxyEventUtil');
            proxyEventUtilModule.proxyEvent = proxyEventFn;

            const { getByQA } = renderAnyComponent(
                <MirrorView viewPortWidth={600} fixedWidth={200} contentWidth={1000} />,
                { container }
            );

            const view = getByQA(QA_SELECTORS.MIRROR);

            fireEvent.mouseDown(view);
            await waitFor(() => {
                expect(proxyEventFn).toBeCalledTimes(1);
            });

            fireEvent.mouseUp(view);
            await waitFor(() => {
                expect(proxyEventFn).toBeCalledTimes(2);
            });

            fireEvent.click(view);
            await waitFor(() => {
                expect(proxyEventFn).toBeCalledTimes(3);
            });
        }
    );
});
