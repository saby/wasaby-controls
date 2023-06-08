/**
 * @jest-environment jsdom
 */
jest.mock('Controls/Utils/InertialScrolling', () => {
    return {
        __esModule: true,
        default: null,
    };
});
import { unmountComponentAtNode } from 'react-dom';
import { WasabyEvents } from 'UICore/Events';
import { fireEvent, waitFor } from '@testing-library/react';
import { renderAnyComponent } from '../../forTestsOnly/helpers';
import { loadSync } from 'WasabyLoader/ModulesLoader';

import ScrollEventsManager from 'Controls/_columnScrollReact/Mirror/ScrollEventsManager';

describe('ControlsUnit/columnScrollReact/Mirror/ScrollEventsManager/Events', () => {
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

    describe('Правильный отстрел события начала и окончания скроллирования.', () => {
        let onScrollStarted: typeof jest.fn;
        let onScroll: typeof jest.fn;
        let onScrollStopped: typeof jest.fn;

        let scrollPromise: Promise<void>;
        let scrollResolver: () => void;
        let componentsContent: HTMLElement;

        beforeEach(() => {
            const InertialScrolling = loadSync<
                typeof import('Controls/Utils/InertialScrolling')
            >('Controls/Utils/InertialScrolling');

            // @ts-ignore
            InertialScrolling.default = class {
                getScrollStopPromise(): Promise<void> {
                    return scrollPromise;
                }

                scrollStarted(): void {
                    if (!scrollPromise) {
                        scrollPromise = new Promise((resolve) => {
                            scrollResolver = resolve;
                        });
                    }
                }
            };

            onScrollStarted = jest.fn();
            onScroll = jest.fn();
            onScrollStopped = jest.fn();

            const dataQA = 'testContent';

            const { getByQA } = renderAnyComponent(
                <ScrollEventsManager
                    onScrollStarted={onScrollStarted}
                    onScroll={onScroll}
                    onScrollStopped={onScrollStopped}
                    content={(props) => {
                        return <div {...props} data-qa={dataQA} />;
                    }}
                />,
                { container }
            );

            componentsContent = getByQA(dataQA);
        });

        afterEach(() => {
            onScrollStarted =
                onScroll =
                onScrollStopped =
                scrollPromise =
                scrollResolver =
                componentsContent =
                    null;
        });

        it(
            'Только touchStart + touchEnd на контенте. ' +
                'Скролла не было, не должно быть нотификаций о нем.',
            async () => {
                fireEvent.touchStart(componentsContent);
                fireEvent.touchEnd(componentsContent);

                await waitFor(() => {
                    expect(onScrollStarted).not.toBeCalled();
                    expect(onScroll).not.toBeCalled();
                    expect(onScrollStopped).not.toBeCalled();
                });
            }
        );

        it(
            'touchStart + scroll + touchEnd на контенте. ' +
                'Инерционный скролл закончился РАНЬШЕ чем случился touchEnd. ' +
                'Должны закончить скроллирование по тачу.',
            async () => {
                // expect.assertions(15);

                // Коснулись, ничего не нотифицируем.
                fireEvent.touchStart(componentsContent);
                await waitFor(() => {
                    expect(onScrollStarted).not.toBeCalled();
                    expect(onScroll).not.toBeCalled();
                    expect(onScrollStopped).not.toBeCalled();
                });

                // Начали скроллить, стреляем scrollStarted и scroll
                fireEvent.scroll(componentsContent);
                await waitFor(() => {
                    expect(onScrollStarted).toBeCalledTimes(1);
                    expect(onScroll).toBeCalledTimes(1);
                    expect(onScrollStopped).not.toBeCalled();
                });

                // Продолжаем скроллить, стреляем только scroll
                fireEvent.scroll(componentsContent);
                await waitFor(() => {
                    expect(onScrollStarted).toBeCalledTimes(1);
                    expect(onScroll).toBeCalledTimes(2);
                    expect(onScrollStopped).not.toBeCalled();
                });

                // Завершаем инерционность (скролл был неотрывным тачем, её впринцепе не было)
                scrollResolver();
                await scrollPromise;
                // После такого отстрела ничего не меняется, нет нотификации, мы не скроллим в данный момент,
                // но сам процесс скроллирования не завершен.
                await waitFor(() => {
                    expect(onScrollStarted).toBeCalledTimes(1);
                    expect(onScroll).toBeCalledTimes(2);
                    expect(onScrollStopped).not.toBeCalled();
                });

                // Отпустили, инерционности нет. нотифицируем об окончании скроллирования.
                fireEvent.touchEnd(componentsContent);
                await waitFor(() => {
                    expect(onScrollStarted).toBeCalledTimes(1);
                    expect(onScroll).toBeCalledTimes(2);
                    expect(onScrollStopped).toBeCalledTimes(1);
                });
            }
        );

        it(
            'touchStart + scroll + touchEnd на контенте. ' +
                'Инерционный скролл закончился ПОЗЖЕ чем случился touchEnd. ' +
                'Должны закончить скроллирование по промису инерции. ' +
                'При этом после тача еще скролл еще двигался какое то время.',
            async () => {
                // expect.assertions(18);

                // Коснулись, ничего не нотифицируем.
                fireEvent.touchStart(componentsContent);
                await waitFor(() => {
                    expect(onScrollStarted).not.toBeCalled();
                    expect(onScroll).not.toBeCalled();
                    expect(onScrollStopped).not.toBeCalled();
                });

                // Начали скроллить, стреляем scrollStarted и scroll
                fireEvent.scroll(componentsContent);
                await waitFor(() => {
                    expect(onScrollStarted).toBeCalledTimes(1);
                    expect(onScroll).toBeCalledTimes(1);
                    expect(onScrollStopped).not.toBeCalled();
                });

                // Продолжаем скроллить, стреляем только scroll
                fireEvent.scroll(componentsContent);
                await waitFor(() => {
                    expect(onScrollStarted).toBeCalledTimes(1);
                    expect(onScroll).toBeCalledTimes(2);
                    expect(onScrollStopped).not.toBeCalled();
                });

                // Отпустили, инерционность есть, значит ничего не нотифицируем.
                // При инерции еще будут стрелять события скролла.
                fireEvent.touchEnd(componentsContent);
                await waitFor(() => {
                    expect(onScrollStarted).toBeCalledTimes(1);
                    expect(onScroll).toBeCalledTimes(2);
                    expect(onScrollStopped).not.toBeCalled();
                });

                // События продолжают стрелять, инерция.
                fireEvent.scroll(componentsContent);
                await waitFor(() => {
                    expect(onScrollStarted).toBeCalledTimes(1);
                    expect(onScroll).toBeCalledTimes(3);
                    expect(onScrollStopped).not.toBeCalled();
                });

                // Завершаем инерционность, завершаем скроллирование, нотифицируем.
                scrollResolver();
                await scrollPromise;
                await waitFor(() => {
                    expect(onScrollStarted).toBeCalledTimes(1);
                    expect(onScroll).toBeCalledTimes(3);
                    expect(onScrollStopped).toBeCalledTimes(1);
                });
            }
        );
    });
});
