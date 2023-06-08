import { Model } from 'Types/entity';
import { GridGroupCell as GroupCell } from 'Controls/grid';
import { CssClassesAssert } from 'ControlsUnit/CustomAsserts';
import { getGroupRowMock } from 'ControlsUnit/_listsUtils/mockOwner';

describe('Controls/_display/GroupCell', () => {
    function getGroupCell(
        params: { isFixed?: boolean } = {}
    ): GroupCell<Model> {
        return new GroupCell({
            contents: {},
            columnsLength: 4,
            column: { width: '150' },
            ...params,
            owner: getGroupRowMock({
                gridColumnsConfig: [{}, {}, {}, {}],
            }),
        });
    }

    describe('.getZIndex()', () => {
        it('fixed cell + column scroll => [4]', () => {
            const cell = getGroupCell({ isFixed: true });
            expect(cell.getZIndex()).toEqual(4);
        });
    });
});
