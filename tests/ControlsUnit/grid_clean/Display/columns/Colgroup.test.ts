import Colgroup from 'Controls/_baseGrid/display/Colgroup';
import { getGridCollectionMock } from 'ControlsUnit/_listsUtils/mockOwner';

describe('Controls/grid_clean/Display/columns/Colgroup', () => {
    it('reinitialize colgroup on columns changed', () => {
        const colgroup = new Colgroup({
            owner: getGridCollectionMock({ gridColumnsConfig: [{}, {}] }),
            gridColumnsConfig: [{}, {}],
        });

        expect(colgroup.getCells().length).toBe(2);

        colgroup.setGridColumnsConfig([{}, {}, {}, {}]);
        expect(colgroup.getCells().length).toBe(4);
    });
});
