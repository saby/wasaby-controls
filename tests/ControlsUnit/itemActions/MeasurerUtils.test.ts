import { MeasurerUtils } from 'Controls/_itemActions/measurers/MeasurerUtils';
import { IItemAction, TItemActionShowType } from 'Controls/interface';

describe('Controls/_itemActions/measurers/MeasurerUtils', () => {
    it('getActualActions', () => {
        const actions: IItemAction[] = [
            {
                id: 1,
                icon: 'icon-PhoneNull',
            },
            {
                id: 2,
                icon: 'icon-Erase',
                showType: TItemActionShowType.TOOLBAR,
            },
            {
                id: 3,
                icon: 'icon-EmptyMessage',
                parent: 1,
            },
            {
                id: 4,
                icon: 'icon-PhoneNull',
                parent: 1,
            },
            {
                id: 5,
                icon: 'icon-Erase',
                showType: TItemActionShowType.FIXED,
            },
            {
                id: 6,
                icon: 'icon-EmptyMessage',
                showType: TItemActionShowType.MENU,
            },
        ];
        const actual: IItemAction[] = [
            {
                id: 2,
                icon: 'icon-Erase',
                showType: TItemActionShowType.TOOLBAR,
            },
            {
                id: 1,
                icon: 'icon-PhoneNull',
            },
            {
                id: 5,
                icon: 'icon-Erase',
                showType: TItemActionShowType.FIXED,
            },
            {
                id: 6,
                icon: 'icon-EmptyMessage',
                showType: TItemActionShowType.MENU,
            },
        ];
        const result = MeasurerUtils.getActualActions(actions);
        expect(actual).toEqual(result);
    });

    describe('sliceAndFixActions', () => {
        // FIXED был отрезан. Должен встать в конце
        it('Fixed Action is sliced. Should replace visible from end', () => {
            const actions: IItemAction[] = [
                {
                    id: 2,
                    icon: 'icon-Erase',
                    showType: TItemActionShowType.TOOLBAR,
                },
                {
                    id: 1,
                    icon: 'icon-PhoneNull',
                },
                {
                    id: 5,
                    icon: 'icon-Erase',
                    showType: TItemActionShowType.FIXED,
                },
                {
                    id: 6,
                    icon: 'icon-EmptyMessage',
                    showType: TItemActionShowType.MENU,
                },
            ];
            const result = MeasurerUtils.sliceAndFixActions(actions, 2);
            expect(result[1]).toEqual(actions[2]);
        });

        // FIXED был не отрезан. Должен остаться на своём месте
        it('Fixed Action is not sliced, not last. Should not change position', () => {
            const actions: IItemAction[] = [
                {
                    id: 2,
                    icon: 'icon-Erase',
                    showType: TItemActionShowType.TOOLBAR,
                },
                {
                    id: 5,
                    icon: 'icon-Erase',
                    showType: TItemActionShowType.FIXED,
                },
                {
                    id: 3,
                    icon: 'icon-EmptyMessage',
                    showType: TItemActionShowType.TOOLBAR,
                },
                {
                    id: 1,
                    icon: 'icon-PhoneNull',
                },
                {
                    id: 6,
                    icon: 'icon-EmptyMessage',
                    showType: TItemActionShowType.MENU,
                },
            ];
            const result = MeasurerUtils.sliceAndFixActions(actions, 3);
            expect(result[1]).toEqual(actions[1]);
            expect(result[2]).toEqual(actions[2]);
        });

        // Один FIXED был отрезан, а второй нет, но последний видимый. Последний видимый должен сдвинуться
        it('Fixed Action is both sliced and not sliced, but last. Should change position of last', () => {
            const actions: IItemAction[] = [
                {
                    id: 1,
                    icon: 'icon-PhoneNull',
                },
                {
                    id: 2,
                    icon: 'icon-Erase',
                    showType: TItemActionShowType.TOOLBAR,
                },
                {
                    id: 3,
                    icon: 'icon-EmptyMessage',
                    showType: TItemActionShowType.FIXED,
                },
                {
                    id: 4,
                    icon: 'icon-PhoneNull',
                    showType: TItemActionShowType.TOOLBAR,
                },
                {
                    id: 5,
                    icon: 'icon-Erase',
                    showType: TItemActionShowType.FIXED,
                },
                {
                    id: 6,
                    icon: 'icon-EmptyMessage',
                    showType: TItemActionShowType.MENU,
                },
            ];
            const result = MeasurerUtils.sliceAndFixActions(actions, 3);
            expect(result[1]).toEqual(actions[2]);
            expect(result[2]).toEqual(actions[4]);
        });
    });
});
