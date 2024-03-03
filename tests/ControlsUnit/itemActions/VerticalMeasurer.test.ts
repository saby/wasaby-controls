import * as rk from 'i18n!ControlsUnit';

import { verticalMeasurer } from 'Controls/_itemActions/measurers/VerticalMeasurer';
import { IItemAction } from 'Controls/interface';
import { IShownItemAction } from 'Controls/_itemActions/interface/IItemActionsObject';
import { Utils } from 'Controls/_itemActions/Utils';

describe('Controls/_itemActions/measurers/VerticalMeasurer', () => {
    it('needIcon', () => {
        expect(verticalMeasurer.needIcon({}, 'bottom')).toBe(false);
        expect(verticalMeasurer.needIcon({}, 'none')).toBe(false);
        expect(verticalMeasurer.needIcon({}, 'right')).toBe(false);
        expect(verticalMeasurer.needIcon({}, 'bottom', true)).toBe(false);
        expect(verticalMeasurer.needIcon({}, 'none', true)).toBe(false);
        expect(verticalMeasurer.needIcon({}, 'right', true)).toBe(true);
        expect(
            verticalMeasurer.needIcon(
                {
                    icon: '123',
                },
                'bottom'
            )
        ).toBe(true);
        expect(
            verticalMeasurer.needIcon(
                {
                    icon: '123',
                },
                'right'
            )
        ).toBe(true);
        expect(
            verticalMeasurer.needIcon(
                {
                    icon: '123',
                },
                'none'
            )
        ).toBe(true);
        expect(
            verticalMeasurer.needIcon(
                {
                    icon: '123',
                },
                'bottom',
                true
            )
        ).toBe(true);
        expect(
            verticalMeasurer.needIcon(
                {
                    icon: '123',
                },
                'right',
                true
            )
        ).toBe(true);
        expect(
            verticalMeasurer.needIcon(
                {
                    icon: '123',
                },
                'none',
                true
            )
        ).toBe(true);
    });

    it('needTitle', () => {
        expect(
            verticalMeasurer.needTitle(
                {
                    icon: 'icon-Message',
                },
                'none'
            )
        ).toBe(false);
        expect(
            verticalMeasurer.needTitle(
                {
                    icon: 'icon-Message',
                },
                'right'
            )
        ).toBe(false);
        expect(verticalMeasurer.needTitle({}, 'none')).toBe(true);
        expect(verticalMeasurer.needTitle({}, 'right')).toBe(true);
        expect(
            verticalMeasurer.needTitle(
                {
                    title: '123',
                },
                'none'
            )
        ).toBe(true);
        expect(
            verticalMeasurer.needTitle(
                {
                    title: '123',
                },
                'right'
            )
        ).toBe(true);
        expect(
            verticalMeasurer.needTitle(
                {
                    title: '123',
                },
                'bottom'
            )
        ).toBe(true);
    });

    describe('getSwipeConfig', () => {
        const actions: IItemAction[] = [
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

        describe('without title', () => {
            it('small row, only menu should be drawn', () => {
                const result = {
                    itemActionsSize: 'm',
                    itemActions: {
                        all: actions,
                        showed: [Utils.getMenuButton(undefined, true)],
                    },
                    paddingSize: 'm',
                    twoColumns: false,
                };

                expect(
                    verticalMeasurer.getSwipeConfig(actions, 150, 20, 'none', 'adaptive', 'default')
                ).toEqual(expect.objectContaining(result));
            });

            it('average row, all actions should be drawn, itemActionsSize should be m', () => {
                const result = {
                    itemActionsSize: 'm',
                    itemActions: {
                        all: actions,
                        showed: actions,
                    },
                    paddingSize: 'm',
                    twoColumns: false,
                };

                expect(
                    verticalMeasurer.getSwipeConfig(actions, 150, 98, 'none', 'adaptive', 'default')
                ).toEqual(expect.objectContaining(result));
            });

            it('big row, all actions should be drawn, itemActionsSize should be l', () => {
                const result = {
                    itemActionsSize: 'l',
                    itemActions: {
                        all: actions,
                        showed: actions,
                    },
                    paddingSize: 'm',
                    twoColumns: false,
                };

                expect(
                    verticalMeasurer.getSwipeConfig(
                        actions,
                        150,
                        150,
                        'none',
                        'adaptive',
                        'default'
                    )
                ).toEqual(expect.objectContaining(result));
            });
        });

        describe('title on the right', () => {
            it('small row, only menu should be drawn', () => {
                const result = {
                    itemActionsSize: 'm',
                    itemActions: {
                        all: actions,
                        showed: [Utils.getMenuButton(undefined, true)],
                    },
                    paddingSize: 'l',
                    twoColumns: false,
                };

                expect(
                    verticalMeasurer.getSwipeConfig(
                        actions,
                        150,
                        20,
                        'right',
                        'adaptive',
                        'default'
                    )
                ).toEqual(expect.objectContaining(result));
            });

            it('average row, all actions should be drawn, itemActionsSize should be m', () => {
                const result = {
                    itemActionsSize: 'm',
                    itemActions: {
                        all: actions,
                        showed: actions,
                    },
                    paddingSize: 'l',
                    twoColumns: false,
                };

                expect(
                    verticalMeasurer.getSwipeConfig(
                        actions,
                        150,
                        120,
                        'right',
                        'adaptive',
                        'default'
                    )
                ).toEqual(expect.objectContaining(result));
            });

            it('big row, all actions should be drawn, itemActionsSize should be l', () => {
                const result = {
                    itemActionsSize: 'l',
                    itemActions: {
                        all: actions,
                        showed: actions,
                    },
                    paddingSize: 'l',
                    twoColumns: false,
                };

                expect(
                    verticalMeasurer.getSwipeConfig(
                        actions,
                        150,
                        150,
                        'right',
                        'adaptive',
                        'default'
                    )
                ).toEqual(expect.objectContaining(result));
            });
        });

        describe('title on the bottom', () => {
            it('two columns', () => {
                const fourActions: IItemAction[] = [
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
                    {
                        id: 4,
                        icon: 'icon-EmptyMessage',
                    },
                ];
                const result = {
                    itemActionsSize: 'm',
                    itemActions: {
                        all: fourActions,
                        showed: fourActions,
                    },
                    paddingSize: 's',
                    twoColumns: true,
                };
                expect(
                    verticalMeasurer.getSwipeConfig(
                        fourActions,
                        150,
                        93,
                        'bottom',
                        'adaptive',
                        'default'
                    )
                ).toEqual(expect.objectContaining(result));
            });
            it('one column with more button', () => {
                const fiveActions: IItemAction[] = [
                    {
                        id: 1,
                        icon: 'icon-PhoneNull',
                    },
                    {
                        id: 2,
                        icon: 'icon-EmptyMessage',
                    },
                    {
                        id: 3,
                        icon: 'icon-EmptyMessage',
                        parent: 2,
                    },
                    {
                        id: 4,
                        icon: 'icon-EmptyMessage',
                        parent: 2,
                    },
                    {
                        id: 5,
                        icon: 'icon-EmptyMessage',
                        parent: 2,
                    },
                ];
                const result = {
                    itemActionsSize: 'm',
                    itemActions: {
                        all: fiveActions,
                        showed: [
                            {
                                id: 1,
                                icon: 'icon-PhoneNull',
                            },
                            Utils.getMenuButton(undefined, true),
                        ],
                    },
                    paddingSize: 's',
                    twoColumns: false,
                };
                expect(
                    verticalMeasurer.getSwipeConfig(
                        fiveActions,
                        150,
                        93,
                        'bottom',
                        'adaptive',
                        'default'
                    )
                ).toEqual(expect.objectContaining(result));
            });
            it('two columns with more button', () => {
                const fiveActions: IItemAction[] = [
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
                    {
                        id: 4,
                        icon: 'icon-EmptyMessage',
                    },
                    {
                        id: 5,
                        icon: 'icon-EmptyMessage',
                    },
                ];
                const result = {
                    itemActionsSize: 'm',
                    itemActions: {
                        all: fiveActions,
                        showed: [
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
                            Utils.getMenuButton(undefined, true),
                        ],
                    },
                    paddingSize: 's',
                    twoColumns: true,
                };
                expect(
                    verticalMeasurer.getSwipeConfig(
                        fiveActions,
                        150,
                        93,
                        'bottom',
                        'adaptive',
                        'default'
                    )
                ).toEqual(expect.objectContaining(result));
            });
            it('menuButtonVisibility = visible', () => {
                const fourActions = [
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
                    {
                        id: 4,
                        icon: 'icon-EmptyMessage',
                    },
                ];
                const result = {
                    itemActionsSize: 'm',
                    itemActions: {
                        all: fourActions,
                        showed: [
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
                            Utils.getMenuButton(undefined, true),
                        ],
                    },
                    paddingSize: 's',
                    twoColumns: false,
                };
                expect(
                    verticalMeasurer.getSwipeConfig(
                        fourActions,
                        150,
                        250,
                        'bottom',
                        'visible',
                        'default'
                    )
                ).toEqual(expect.objectContaining(result));
            });
            it('small row, only menu should be drawn', () => {
                const result = {
                    itemActionsSize: 'm',
                    itemActions: {
                        all: actions,
                        showed: [Utils.getMenuButton(undefined, true)],
                    },
                    paddingSize: 's',
                    twoColumns: false,
                };

                expect(
                    verticalMeasurer.getSwipeConfig(
                        actions,
                        150,
                        20,
                        'bottom',
                        'adaptive',
                        'default'
                    )
                ).toEqual(expect.objectContaining(result));
            });

            it('average row, all actions should be drawn, itemActionsSize should be s', () => {
                const result = {
                    itemActionsSize: 'm',
                    itemActions: {
                        all: actions,
                        showed: actions,
                    },
                    paddingSize: 's',
                    twoColumns: false,
                };

                expect(
                    verticalMeasurer.getSwipeConfig(
                        actions,
                        150,
                        170,
                        'bottom',
                        'adaptive',
                        'default'
                    )
                ).toEqual(expect.objectContaining(result));
            });

            it('big row, all actions should be drawn, itemActionsSize should be l', () => {
                const result = {
                    itemActionsSize: 'l',
                    itemActions: {
                        all: actions,
                        showed: actions,
                    },
                    paddingSize: 'l',
                    twoColumns: false,
                };

                expect(
                    verticalMeasurer.getSwipeConfig(
                        actions,
                        150,
                        200,
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
                        showType: 2,
                        icon: 'icon-PhoneNull',
                    },
                    {
                        id: 2,
                        showType: 2,
                        icon: 'icon-Erase',
                    },
                    {
                        id: 6,
                        icon: 'icon-PhoneNull',
                        parent: 1,
                    },
                    {
                        id: 3,
                        showType: 0,
                        icon: 'icon-EmptyMessage',
                    },
                    {
                        id: 4,
                        showType: 2,
                        icon: 'icon-Profile',
                    },
                    {
                        id: 5,
                        showType: 0,
                        icon: 'icon-DK',
                    },
                ];
                const result: IShownItemAction[] = [
                    {
                        id: 1,
                        showType: 2,
                        icon: 'icon-PhoneNull',
                    },
                    {
                        id: 2,
                        showType: 2,
                        icon: 'icon-Erase',
                    },
                    Utils.getMenuButton(undefined, true),
                ];
                expect(
                    verticalMeasurer.getSwipeConfig(
                        otherActions,
                        150,
                        130,
                        'none',
                        'adaptive',
                        'default'
                    ).itemActions.showed
                ).toEqual(result);
            });
        });
    });
});
