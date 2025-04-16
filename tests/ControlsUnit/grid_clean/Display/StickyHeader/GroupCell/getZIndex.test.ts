import { GridGroupCell } from 'Controls/grid';
import { getGroupRowMock } from 'ControlsUnit/_listsUtils/mockOwner';

const column = { displayProperty: 'col1' };
const TEST_Z_INDEX = 3;

describe('Controls/grid_clean/Display/StickyHeader/GroupCell/getZIndex', () => {
    it('getZIndex returns value from options ', () => {
        const gridGroupCell = new GridGroupCell({
            owner: getGroupRowMock({
                gridColumnsConfig: [column],
                isStickyHeader: true,
                leftPadding: 's',
                rightPadding: 's',
            }),
            columns: [column],
            column,
            zIndex: TEST_Z_INDEX,
        });
        const zIndex = gridGroupCell.getZIndex();
        expect(zIndex).toBe(TEST_Z_INDEX);
    });
});
