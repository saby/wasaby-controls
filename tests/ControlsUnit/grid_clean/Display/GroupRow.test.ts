import { GridGroupRow } from 'Controls/grid';
import { getGridCollectionMock } from 'ControlsUnit/_listsUtils/mockOwner';

describe('Controls/grid_clean/Display/GroupRow', () => {
    it('readonly states', () => {
        const groupRow = new GridGroupRow({
            owner: getGridCollectionMock({
                gridColumnsConfig: [{}, {}],
            }),
        });
        expect(groupRow.Markable).toBe(false);
        expect(groupRow.SelectableItem).toBe(false);
        expect(groupRow.DisplayItemActions).toBe(false);
        expect(groupRow.DraggableItem).toBe(false);
        expect(groupRow.LadderSupport).toBe(false);
        expect(groupRow.SupportItemActions).toBe(false);
    });
});
