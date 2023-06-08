import * as rk from 'i18n!ControlsUnit';

import { IShownItemAction } from 'Controls/_itemActions/interface/IItemActionsObject';
import { IItemAction, TItemActionShowType } from 'Controls/interface';
import { horizontalMeasurer } from 'Controls/_itemActions/measurers/HorizontalMeasurer';
import { DOMUtil } from 'Controls/sizeUtils';

describe('Controls/_itemActions/measurers/HorizontalMeasurer', () => {
    it('needIcon', () => {
        expect(horizontalMeasurer.needIcon({}, 'none', true)).toBe(false);
        expect(horizontalMeasurer.needIcon({}, 'none', false)).toBe(false);
        expect(horizontalMeasurer.needIcon({}, 'right', false)).toBe(false);
        expect(horizontalMeasurer.needIcon({}, 'right', true)).toBe(true);
        expect(
            horizontalMeasurer.needIcon(
                {
                    id: 123,
                    icon: '123',
                },
                'none',
                true
            )
        ).toBe(true);
        expect(
            horizontalMeasurer.needIcon(
                {
                    id: 123,
                    icon: '123',
                },
                'none',
                false
            )
        ).toBe(true);
    });

    it('needTitle', () => {
        expect(
            horizontalMeasurer.needTitle(
                {
                    id: 123,
                    icon: 'icon-Message',
                },
                'none'
            )
        ).toBe(false);
        expect(
            horizontalMeasurer.needTitle(
                {
                    id: 123,
                    icon: 'icon-Message',
                },
                'right'
            )
        ).toBe(false);
        expect(horizontalMeasurer.needTitle({}, 'none')).toBe(true);
        expect(horizontalMeasurer.needTitle({}, 'right')).toBe(true);
        expect(
            horizontalMeasurer.needTitle(
                {
                    id: 123,
                    title: '123',
                },
                'none'
            )
        ).toBe(true);
        expect(
            horizontalMeasurer.needTitle(
                {
                    id: 123,
                    title: '123',
                },
                'right'
            )
        ).toBe(true);
        expect(
            horizontalMeasurer.needTitle(
                {
                    id: 123,
                    title: '123',
                },
                'bottom'
            )
        ).toBe(true);
    });

    describe('getSwipeConfig', () => {
        const actions: IShownItemAction[] = [
            {
                id: 1,
                icon: 'icon-PhoneNull',
            },
            {
                id: 2,
                icon: 'icon-Erase',
            },
            {
                id: 3,
                icon: 'icon-EmptyMessage',
            },
        ];

        let stubGetElementsWidth;

        beforeEach(() => {
            stubGetElementsWidth = jest
                .spyOn(DOMUtil, 'getElementsWidth')
                .mockClear()
                .mockImplementation(
                    (
                        itemsHtml: string[],
                        itemClass: string,
                        considerMargins?: boolean
                    ) => {
                        return itemsHtml.map((item) => {
                            return 25;
                        });
                    }
                );
            jest.spyOn(DOMUtil, 'getWidthForCssClass')
                .mockClear()
                .mockReturnValue(0);
        });

        // Если кол-во записей > 3, то показываем максимум 3 (если они влезли) и добавляем кнопку "ещё"
        it("should add menu, when more than 3 itemActions are in 'showed' array", () => {
            const result = {
                itemActionsSize: 'm',
                itemActions: {
                    all: actions.concat({
                        id: 4,
                        icon: 'icon-DK',
                    }),
                    showed: actions.concat({
                        id: null,
                        icon: 'icon-SwipeMenu',
                        title: rk('Ещё'),
                        isMenu: true,
                        showType: TItemActionShowType.TOOLBAR,
                    }),
                },
                paddingSize: 'm',
            };

            expect(
                horizontalMeasurer.getSwipeConfig(
                    actions.concat({
                        id: 4,
                        icon: 'icon-DK',
                    }),
                    100,
                    20,
                    'right',
                    'adaptive',
                    'default'
                )
            ).toEqual(expect.objectContaining(result));
        });

        // Если кол-во записей > 3 и видимые записи не влезли в контейнер, показываем столько, сколько влезло
        // eslint-disable-next-line max-len
        it('should show only item actions that are smaller than container by their summarized width when total > 3', () => {
            const showed = [...actions];
            showed.splice(-1, 1, {
                id: null,
                icon: 'icon-SwipeMenu',
                title: rk('Ещё'),
                isMenu: true,
                showType: TItemActionShowType.TOOLBAR,
            });
            const result = {
                itemActionsSize: 'm',
                itemActions: {
                    all: actions.concat({
                        id: 4,
                        icon: 'icon-DK',
                    }),
                    showed,
                },
                paddingSize: 'm',
            };
            expect(
                horizontalMeasurer.getSwipeConfig(
                    actions.concat({
                        id: 4,
                        icon: 'icon-DK',
                    }),
                    75,
                    20,
                    'right',
                    'adaptive',
                    'default'
                )
            ).toEqual(expect.objectContaining(result));
        });

        // Если кол-во записей <= 3 и видимые записи не влезли в контейнер, показываем столько, сколько влезло
        // eslint-disable-next-line max-len
        it('should show only item actions that are smaller than container by their summarized width when total <= 3', () => {
            stubGetElementsWidth.mockImplementation(
                (
                    itemsHtml: string[],
                    itemClass: string,
                    considerMargins?: boolean
                ) => {
                    return itemsHtml.map((item, index) => {
                        return 25 + index;
                    });
                }
            );

            const lessActions = [...actions];
            lessActions.splice(-1, 1);

            const showed = [...lessActions];
            showed.splice(-1, 1, {
                id: null,
                icon: 'icon-SwipeMenu',
                title: rk('Ещё'),
                isMenu: true,
                showType: TItemActionShowType.TOOLBAR,
            });

            const result = {
                itemActionsSize: 'm',
                itemActions: {
                    all: lessActions,
                    showed,
                },
                paddingSize: 'm',
            };
            const config = horizontalMeasurer.getSwipeConfig(
                lessActions,
                50,
                20,
                'right',
                'adaptive',
                'default'
            );
            expect(config).toEqual(expect.objectContaining(result));
        });

        // Если кол-во записей <= 3 и видимые записи влезли в контейнер, не показываем кнопку "Ещё"
        it('should not show menu button when item actions are smaller than container by their summarized width and total <= 3', () => {
            const lessActions = [...actions];
            lessActions.splice(-1, 1);

            const result = {
                itemActionsSize: 'm',
                itemActions: {
                    all: lessActions,
                    showed: lessActions,
                },
                paddingSize: 'm',
            };
            const config = horizontalMeasurer.getSwipeConfig(
                lessActions,
                50,
                20,
                'right',
                'adaptive',
                'default'
            );
            expect(config).toEqual(expect.objectContaining(result));
        });

        // Если menuButtonVisibility===visible, то показываем кнопку "Ещё"
        it('should show menu button when menuButtonVisibility===visible', () => {
            const lessActions = [...actions];
            lessActions.splice(-1, 1);

            const result = {
                itemActionsSize: 'm',
                itemActions: {
                    all: lessActions,
                    showed: lessActions.concat({
                        id: null,
                        icon: 'icon-SwipeMenu',
                        title: rk('Ещё'),
                        isMenu: true,
                        showType: TItemActionShowType.TOOLBAR,
                    }),
                },
                paddingSize: 'm',
            };
            const config = horizontalMeasurer.getSwipeConfig(
                lessActions,
                75,
                20,
                'right',
                'visible',
                'default'
            );
            expect(config).toEqual(expect.objectContaining(result));
        });

        it('small row without title, itemActionsSize should be m', () => {
            const result = {
                itemActionsSize: 'm',
                itemActions: {
                    all: actions,
                    showed: actions,
                },
                paddingSize: 'm',
            };

            expect(
                horizontalMeasurer.getSwipeConfig(
                    actions,
                    100,
                    20,
                    'none',
                    'adaptive',
                    'default'
                )
            ).toEqual(expect.objectContaining(result));
        });

        it('big row without title, itemActionsSize should be l', () => {
            const result = {
                itemActionsSize: 'l',
                itemActions: {
                    all: actions,
                    showed: actions,
                },
                paddingSize: 'm',
            };

            expect(
                horizontalMeasurer.getSwipeConfig(
                    actions,
                    100,
                    39,
                    'none',
                    'adaptive',
                    'default'
                )
            ).toEqual(expect.objectContaining(result));
        });

        it('small row with title, itemActionsSize should be m', () => {
            const result = {
                itemActionsSize: 'm',
                itemActions: {
                    all: actions,
                    showed: actions,
                },
                paddingSize: 'm',
            };

            expect(
                horizontalMeasurer.getSwipeConfig(
                    actions,
                    100,
                    20,
                    'bottom',
                    'adaptive',
                    'default'
                )
            ).toEqual(expect.objectContaining(result));
        });

        it('big row with title, itemActionsSize should be l', () => {
            const result = {
                itemActionsSize: 'l',
                itemActions: {
                    all: actions,
                    showed: actions,
                },
                paddingSize: 'm',
            };

            expect(
                horizontalMeasurer.getSwipeConfig(
                    actions,
                    100,
                    59,
                    'bottom',
                    'adaptive',
                    'default'
                )
            ).toEqual(expect.objectContaining(result));
        });

        it('main actions', () => {
            const otherActions: IItemAction[] = [
                {
                    id: 1,
                    showType: TItemActionShowType.TOOLBAR,
                    icon: 'icon-PhoneNull',
                },
                {
                    id: 5,
                    icon: 'icon-PhoneNull',
                    parent: 1,
                },
                {
                    id: 2,
                    showType: TItemActionShowType.TOOLBAR,
                    icon: 'icon-Erase',
                },
                {
                    id: 3,
                    showType: TItemActionShowType.MENU,
                    icon: 'icon-EmptyMessage',
                },
                {
                    id: 4,
                    showType: TItemActionShowType.TOOLBAR,
                    icon: 'icon-Profile',
                },
            ];
            const result: IShownItemAction[] = [
                {
                    id: 1,
                    showType: TItemActionShowType.TOOLBAR,
                    icon: 'icon-PhoneNull',
                },
                {
                    id: 2,
                    showType: TItemActionShowType.TOOLBAR,
                    icon: 'icon-Erase',
                },
                {
                    id: 4,
                    showType: TItemActionShowType.TOOLBAR,
                    icon: 'icon-Profile',
                },
                {
                    id: null,
                    icon: 'icon-SwipeMenu',
                    title: rk('Ещё'),
                    isMenu: true,
                    showType: TItemActionShowType.TOOLBAR,
                },
            ];
            expect(result).toEqual(
                horizontalMeasurer.getSwipeConfig(
                    otherActions,
                    100,
                    59,
                    'none',
                    'adaptive',
                    'default'
                ).itemActions.showed
            );
        });

        describe('FIXED actions', () => {
            it('Fixed Action is sliced. Should replace visible from end', () => {
                const actions: IItemAction[] = [
                    {
                        id: 1,
                        showType: TItemActionShowType.TOOLBAR,
                        icon: 'icon-PhoneNull',
                    },
                    {
                        id: 2,
                        icon: 'icon-PhoneNull',
                        parent: 1,
                    },
                    {
                        id: 3,
                        showType: TItemActionShowType.TOOLBAR,
                        icon: 'icon-Erase',
                    },
                    {
                        id: 4,
                        showType: TItemActionShowType.MENU,
                        icon: 'icon-EmptyMessage',
                    },
                    {
                        id: 5,
                        showType: TItemActionShowType.FIXED,
                        icon: 'icon-Bell',
                    },
                    {
                        id: 6,
                        showType: TItemActionShowType.TOOLBAR,
                        icon: 'icon-Profile',
                    },
                ];
                const result = horizontalMeasurer.getSwipeConfig(
                    actions,
                    100,
                    59,
                    'none',
                    'adaptive',
                    'default'
                );
                expect(result.itemActions.showed[2]).toEqual(actions[4]);
            });

            it('Fixed Action is not sliced, not last. Should not change position', () => {
                const actions: IItemAction[] = [
                    {
                        id: 1,
                        showType: TItemActionShowType.TOOLBAR,
                        icon: 'icon-PhoneNull',
                    },
                    {
                        id: 6,
                        showType: TItemActionShowType.FIXED,
                        icon: 'icon-Profile',
                    },
                    {
                        id: 2,
                        icon: 'icon-PhoneNull',
                        parent: 1,
                    },
                    {
                        id: 3,
                        showType: TItemActionShowType.TOOLBAR,
                        icon: 'icon-Erase',
                    },
                    {
                        id: 4,
                        showType: TItemActionShowType.MENU,
                        icon: 'icon-EmptyMessage',
                    },
                    {
                        id: 5,
                        showType: TItemActionShowType.TOOLBAR,
                        icon: 'icon-Bell',
                    },
                ];
                const result = horizontalMeasurer.getSwipeConfig(
                    actions,
                    100,
                    59,
                    'none',
                    'adaptive',
                    'default'
                );
                expect(result.itemActions.showed[1]).toEqual(actions[1]);
            });

            it('Fixed Action is both sliced and not sliced, but last. Should change position of last', () => {
                const actions: IItemAction[] = [
                    {
                        id: 1,
                        showType: TItemActionShowType.TOOLBAR,
                        icon: 'icon-PhoneNull',
                    },
                    {
                        id: 2,
                        icon: 'icon-PhoneNull',
                        showType: TItemActionShowType.TOOLBAR,
                        parent: 1,
                    },
                    {
                        id: 3,
                        showType: TItemActionShowType.FIXED,
                        icon: 'icon-Erase',
                    },
                    {
                        id: 4,
                        showType: TItemActionShowType.MENU,
                        icon: 'icon-EmptyMessage',
                    },
                    {
                        id: 5,
                        showType: TItemActionShowType.TOOLBAR,
                        icon: 'icon-Bell',
                    },
                    {
                        id: 6,
                        showType: TItemActionShowType.FIXED,
                        icon: 'icon-Profile',
                    },
                ];
                const result = horizontalMeasurer.getSwipeConfig(
                    actions,
                    100,
                    59,
                    'none',
                    'adaptive',
                    'default'
                );
                expect(result.itemActions.showed[1]).toEqual(actions[2]);
                expect(result.itemActions.showed[2]).toEqual(actions[5]);
            });
        });
    });
});
