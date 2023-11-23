/**
 * @jest-environment jsdom
 */
import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import StickyBlockReactView from 'Controls/_stickyBlock/StickyBlockReactView';

describe('Controls/_stickyBlock/StickyBlockReact', () => {
    let container = null;
    beforeEach(() => {
        container = document.createElement('div');
        container.className += 'controls-Scroll controls-Scroll-Container';
        document.body.appendChild(container);
    });

    afterEach(() => {
        unmountComponentAtNode(container);
        container.remove();
        container = null;
    });

    function getDefaultProps(): object {
        return {
            wasabyContext: {
                listScrollContext: {
                    horizontalScrollMode: 'default',
                },
            },
            $wasabyRef: jest.fn(),
            register: jest.fn(),
            unregister: jest.fn(),
            onFixedCallback: jest.fn(),
            position: '',
        };
    }

    // Удаление рандомных stickyblockid с ноды.
    function removeStickyIdFromElement(container: HTMLElement): void {
        const elements = container.querySelectorAll<HTMLElement>('[data-stickyblockid]');
        Array.from(elements).forEach((element) => {
            element.removeAttribute('data-stickyblockid');
        });
    }

    it('Стики блок рендерится с top = 10, left = 0, верхняя тень включена', () => {
        const stickyModel = {
            shadow: {
                top: true,
                bottom: false,
                left: false,
                right: false,
            },
            offset: {
                top: 10,
                bottom: undefined,
                left: 0,
                right: undefined,
            },
            fixedPosition: '',
            syntheticFixedPosition: {
                prevPosition: '',
                fixedPosition: '',
            },
        };
        const setStickyId = jest.fn();
        act(() => {
            render(
                <StickyBlockReactView
                    stickyModel={stickyModel}
                    setStickyId={setStickyId}
                    {...getDefaultProps()}
                >
                    <div>1</div>
                </StickyBlockReactView>,
                container
            );
        });
        removeStickyIdFromElement(container);
        expect(container).toMatchSnapshot();
    });

    it('Стики блок рендерится с top = -10, left = 0, левая тень включена', () => {
        const stickyModel = {
            shadow: {
                top: false,
                bottom: false,
                left: true,
                right: false,
            },
            offset: {
                top: -10,
                bottom: undefined,
                left: 0,
                right: undefined,
            },
            fixedPosition: '',
            syntheticFixedPosition: {
                prevPosition: '',
                fixedPosition: '',
            },
        };
        const setStickyId = jest.fn();
        act(() => {
            render(
                <StickyBlockReactView
                    stickyModel={stickyModel}
                    setStickyId={setStickyId}
                    {...getDefaultProps()}
                >
                    <div>1</div>
                </StickyBlockReactView>,
                container
            );
        });
        removeStickyIdFromElement(container);
        expect(container).toMatchSnapshot();
    });

    it('Стики блок рендерится со всеми тенями', () => {
        const stickyModel = {
            shadow: {
                top: true,
                bottom: true,
                left: true,
                right: true,
            },
            offset: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
            },
            fixedPosition: '',
            syntheticFixedPosition: {
                prevPosition: '',
                fixedPosition: '',
            },
        };
        const setStickyId = jest.fn();
        act(() => {
            render(
                <StickyBlockReactView
                    stickyModel={stickyModel}
                    setStickyId={setStickyId}
                    {...getDefaultProps()}
                >
                    <div>1</div>
                </StickyBlockReactView>,
                container
            );
        });
        removeStickyIdFromElement(container);
        expect(container).toMatchSnapshot();
    });

    it('Стики блок строится с заданным классом и стилем, а также со следующими опциями: backgroundStyle=danger, zIndex=3, fixedPosition=top.', () => {
        const stickyModel = {
            shadow: {
                top: false,
                bottom: false,
                left: false,
                right: false,
            },
            offset: {
                top: 0,
                bottom: undefined,
                left: undefined,
                right: undefined,
            },
            fixedPosition: 'top',
            syntheticFixedPosition: {
                prevPosition: '',
                fixedPosition: 'top',
            },
        };
        const attrs = {
            class: 'testClass',
            style: { background: 'red' },
        };
        const setStickyId = jest.fn();
        act(() => {
            render(
                <StickyBlockReactView
                    stickyModel={stickyModel}
                    setStickyId={setStickyId}
                    attrs={attrs}
                    backgroundStyle={'danger'}
                    customProp={'test'}
                    zIndex={3}
                    {...getDefaultProps()}
                >
                    <div>1</div>
                </StickyBlockReactView>,
                container
            );
        });
        removeStickyIdFromElement(container);
        expect(container).toMatchSnapshot();
    });

    it(
        'Стики блок вызывает "register" и "onFixedCallback" при построении и зовет "unregister" при' +
            ' размонтировании',
        () => {
            const stickyModel = {
                shadow: {
                    top: true,
                    bottom: false,
                    left: false,
                    right: false,
                },
                offset: {
                    top: undefined,
                    bottom: undefined,
                    left: undefined,
                    right: undefined,
                },
                fixedPosition: '',
                syntheticFixedPosition: {
                    prevPosition: '',
                    fixedPosition: '',
                },
            };
            const setStickyId = jest.fn();

            const register = jest.fn();
            const unregister = jest.fn();
            const onFixedCallback = jest.fn();

            act(() => {
                render(
                    <StickyBlockReactView
                        stickyModel={stickyModel}
                        setStickyId={setStickyId}
                        {...getDefaultProps()}
                        register={register}
                        unregister={unregister}
                        onFixedCallback={onFixedCallback}
                    >
                        <div>1</div>
                    </StickyBlockReactView>,
                    container
                );
            });
            expect(register).toHaveBeenCalledTimes(1);
            expect(onFixedCallback).toHaveBeenCalledTimes(1);
            expect(unregister).toHaveBeenCalledTimes(0);
            unmountComponentAtNode(container);
            expect(register).toHaveBeenCalledTimes(1);
            expect(unregister).toHaveBeenCalledTimes(1);
            expect(onFixedCallback).toHaveBeenCalledTimes(2);
        }
    );
});
