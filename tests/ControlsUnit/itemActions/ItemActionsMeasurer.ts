import { IItemAction, IItemActionsObject, Utils } from 'Controls/ItemActions';
import { getActions } from 'Controls/_itemActions/measurers/ItemActionMeasurer';

describe('itemActionsMeasurer', () => {
    const actions: IItemAction[] = [
        {
            id: 1,
            icon: 'icon-PhoneNull',
            'parent@': false,
            parent: 2,
        },
        {
            id: 2,
            'parent@': true,
            parent: null,
            icon: 'icon-Erase',
        },
        {
            id: 3,
            icon: 'icon-EmptyMessage',
        },
    ];
    const itemActions = {
        all: actions,
        showed: [Utils.getMenuButton(undefined, true)],
    };
    it('returns only root actions with menu button', () => {
        const resultActions = getActions(itemActions, 'm', null, 400);
        expect(
            !!resultActions.showed.find((action) => {
                return action['parent@'];
            })
        ).toBe(false);
        expect(
            !!resultActions.showed.find((action) => {
                return action.isMenu;
            })
        ).toBe(true);
        expect(
            !!resultActions.showed.find((action) => {
                return !!action.parent;
            })
        ).toBe(false);
    });
});
