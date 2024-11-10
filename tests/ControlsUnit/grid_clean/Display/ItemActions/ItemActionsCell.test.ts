import { GridItemActionsCell } from 'Controls/grid';
import { getRowMock } from 'ControlsUnit/_listsUtils/mockOwner';

describe('Controls/_baseGrid/display/ItemActionsCell', () => {
    let hasVisibleActions: boolean;
    let isEditing: boolean;
    let DisplayItemActions = true;

    const getCell = () => {
        return new GridItemActionsCell({
            owner: getRowMock({
                gridColumnsConfig: [{}],
                hasVisibleActions,
                shouldDisplayItemActions: hasVisibleActions || isEditing,
                hoverBackgroundStyle: '',
                topPadding: 'null',
                bottomPadding: 'null',
                isEditing,
                editingBackgroundStyle: 'default',
                rowSeparatorSize: 's',
                DisplayItemActions,
            }),
            column: {},
        });
    };

    beforeEach(() => {
        hasVisibleActions = false;
        isEditing = false;
        DisplayItemActions = true;
    });

    it('getWrapperStyles', () => {
        expect(getCell().getWrapperStyles()).toEqual(
            'width: 0px; min-width: 0px; max-width: 0px; padding: 0px; z-index: 2;'
        );
    });

    it("+DataCell, -isEditing, -hasVisibleActions = don't display itemActions", () => {
        expect(getCell().shouldDisplayItemActions()).toBe(false);
    });

    it("-DataCell, +hasVisibleActions = don't display itemActions", () => {
        hasVisibleActions = true;
        DisplayItemActions = false;
        expect(getCell().shouldDisplayItemActions()).toBe(false);
    });

    it('+DataCell, -isEditing, +hasVisibleActions = display itemActions', () => {
        hasVisibleActions = true;
        expect(getCell().shouldDisplayItemActions()).toBe(true);
    });

    it('+DataCell, +isEditing, -hasVisibleActions = display itemActions', () => {
        isEditing = true;
        expect(getCell().shouldDisplayItemActions()).toBe(true);
    });
});
