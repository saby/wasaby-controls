/**
 * @jest-environment jsdom
 */
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import StickyGroup from 'Controls/_stickyBlock/StickyGroup';
import StickyGroupedBlock from 'Controls/_stickyBlock/StickyGroupedBlock';

describe('Controls/_stickyBlock/StickyGroup', () => {
    let container = null;
    let groupProps;
    let defaultProps;
    beforeEach(() => {
        container = document.createElement('div');
        container.className += 'controls-Scroll controls-Scroll-Container';
        document.body.appendChild(container);
        groupProps = {
            groupChangeFixedPositionCallback: jest.fn(),
            setStickyGroupId: jest.fn(),
            registerCallback: jest.fn(),
            removedBlockInGroupCallback: jest.fn(),
            addedBlockInGroupCallback: jest.fn(),
            unregisterCallback: jest.fn(),
            offsetChangedCallback: jest.fn(),
            position: 'top',
            scrollState: {
                horizontalScrollMode: '',
            },
        };
        defaultProps = {
            $wasabyRef: jest.fn(),
            onFixedCallback: jest.fn(),
            position: '',
        };

        const mockIntersectionObserver = jest.fn();
        mockIntersectionObserver.mockReturnValue({
            observe: () => {
                return null;
            },
            unobserve: () => {
                return null;
            },
            disconnect: () => {
                return null;
            },
        });
        window.IntersectionObserver = mockIntersectionObserver;
    });

    afterEach(() => {
        unmountComponentAtNode(container);
        container.remove();
        container = null;
    });

    // Удаление рандомных stickyblockid с ноды.
    function removeStickyIdFromElement(container: HTMLElement): void {
        const elements = container.querySelectorAll<HTMLElement>('[data-stickyblockid]');
        Array.from(elements).forEach((element) => {
            element.removeAttribute('data-stickyblockid');
        });
    }

    it('Стики блоки регистрируются в группе, группа регистрируется в контроллере один раз', () => {
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
            fixedPosition: '',
            syntheticFixedPosition: {
                prevPosition: '',
                fixedPosition: '',
            },
        };

        act(() => {
            render(
                <StickyGroup stickyModel={stickyModel} {...groupProps}>
                    <StickyGroupedBlock {...defaultProps}>
                        <div>1</div>
                    </StickyGroupedBlock>
                    <StickyGroupedBlock {...defaultProps}>
                        <div>1</div>
                    </StickyGroupedBlock>
                </StickyGroup>,
                container
            );

            render(
                <StickyGroup stickyModel={stickyModel} {...groupProps}>
                    <StickyGroupedBlock {...defaultProps}>
                        <div>1</div>
                    </StickyGroupedBlock>
                    <StickyGroupedBlock {...defaultProps}>
                        <div>1</div>
                    </StickyGroupedBlock>
                </StickyGroup>,
                container
            );
        });
        unmountComponentAtNode(container);
        expect(groupProps.registerCallback).toHaveBeenCalledTimes(1);
        expect(groupProps.addedBlockInGroupCallback).toHaveBeenCalledTimes(1);
        expect(groupProps.unregisterCallback).toHaveBeenCalledTimes(1);
        expect(groupProps.removedBlockInGroupCallback).toHaveBeenCalledTimes(0);
    });

    it('StickyGroupedBlock строится по заданной модели', () => {
        const stickyModel = {
            shadow: {
                top: false,
                bottom: true,
                left: false,
                right: false,
            },
            offset: {
                top: undefined,
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

        act(() => {
            render(
                <StickyGroup stickyModel={stickyModel} {...groupProps}>
                    <StickyGroupedBlock {...defaultProps}>
                        <div>1</div>
                    </StickyGroupedBlock>
                    <StickyGroupedBlock {...defaultProps}>
                        <div>1</div>
                    </StickyGroupedBlock>
                </StickyGroup>,
                container
            );

            const stickyModel2 = {
                ...stickyModel,
                offset: {
                    top: 5,
                    bottom: undefined,
                    left: undefined,
                    right: undefined,
                },
            };

            render(
                <StickyGroup stickyModel={stickyModel2} {...groupProps}>
                    <StickyGroupedBlock {...defaultProps}>
                        <div>1</div>
                    </StickyGroupedBlock>
                    <StickyGroupedBlock {...defaultProps}>
                        <div>1</div>
                    </StickyGroupedBlock>
                </StickyGroup>,
                container
            );
        });
        removeStickyIdFromElement(container);
        expect(container).toMatchSnapshot();
    });
});
