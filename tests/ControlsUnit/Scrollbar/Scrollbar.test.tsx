/**
 * @jest-environment jsdom
 */
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import ScrollbarReact from 'Controls/_scrollbar/ScrollbarReact';
import { WasabyEvents } from 'UICore/Events';

describe('Controls/_scrollbar/Scrollbar', () => {
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

    let resizeFuncMock: Function;
    class ResizeObserver {
        resizeFunc: Function;

        constructor(resizeCallback: Function) {
            this.resizeFunc = resizeCallback;
            resizeFuncMock = resizeCallback;
        }

        observe(): void {
            // mock
        }
        unobserve(): void {
            // mock
        }
        disconnect(): void {
            // mock
        }
    }

    it('Скроллбар строится с нулевой позицией', () => {
        act(() => {
            render(
                <ScrollbarReact
                    attrs={{}}
                    ref={jest.fn()}
                    contentSize={1000}
                    paddings={{ start: false, end: false }}
                ></ScrollbarReact>,
                container
            );
        });
        expect(container).toMatchSnapshot();
    });

    it('Горизонтальный скроллбар строится с нулевой позицией', () => {
        act(() => {
            render(
                <ScrollbarReact
                    attrs={{}}
                    ref={jest.fn()}
                    contentSize={1000}
                    direction={'horizontal'}
                    paddings={{ start: false, end: false }}
                ></ScrollbarReact>,
                container
            );
        });
        expect(container).toMatchSnapshot();
    });

    it('Скроллбар строится в ненулевой позицией с заданной опцией position (position = 10)', () => {
        const srcResizeObserver = window.ResizeObserver;
        window.ResizeObserver = ResizeObserver;

        act(() => {
            render(
                <ScrollbarReact
                    attrs={{}}
                    ref={jest.fn()}
                    position={10}
                    contentSize={1000}
                    paddings={{ start: false, end: false }}
                ></ScrollbarReact>,
                container
            );
            resizeFuncMock([
                {
                    contentRect: { height: 600 },
                },
            ]);
        });
        window.ResizeObserver = srcResizeObserver;
        expect(container).toMatchSnapshot();
    });

    it('Скроллбар строится с нижним отступом', () => {
        act(() => {
            render(
                <ScrollbarReact
                    attrs={{}}
                    ref={jest.fn()}
                    contentSize={1000}
                    paddings={{ start: false, end: true }}
                ></ScrollbarReact>,
                container
            );
        });
        expect(container).toMatchSnapshot();
    });

    it('Скроллбар строится с опциями thumbThickness=s и thumbStyle=unaccented', () => {
        act(() => {
            render(
                <ScrollbarReact
                    attrs={{}}
                    ref={jest.fn()}
                    contentSize={1000}
                    thumbThickness={'s'}
                    thumbStyle={'unaccented'}
                    paddings={{ start: false, end: false }}
                ></ScrollbarReact>,
                container
            );
        });
        expect(container).toMatchSnapshot();
    });
});
