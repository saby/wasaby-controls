import { GridGroupRow as GridGroupItem } from 'Controls/grid';
import { getGridCollectionMock } from 'ControlsUnit/_listsUtils/mockOwner';

const column = { displayProperty: 'col1' };
const GROUP_Z_INDEX_DEFAULT = 3;
const GROUP_Z_INDEX_WITHOUT_HEADERS_AND_RESULTS = 3;

describe('Controls/grid_clean/Display/StickyHeader/GroupItem/getStickyHeaderZIndex', () => {
    function getGroupItem({ hasHeader, resultsPosition }) {
        return new GridGroupItem({
            owner: getGridCollectionMock({
                gridColumnsConfig: [column],
                isStickyHeader: true,
                leftPadding: 's',
                rightPadding: 's',
                hasHeader,
                resultsPosition,
            }),
        });
    }
    it('getStickyHeaderZIndex with header and results', () => {
        const gridGroupItem = getGroupItem({
            hasHeader: true,
            resultsPosition: 'top',
        });
        const zIndex = gridGroupItem.getStickyHeaderZIndex();
        expect(zIndex).toBe(GROUP_Z_INDEX_DEFAULT);
    });
    it('getStickyHeaderZIndex with header', () => {
        const gridGroupItem = getGroupItem({
            hasHeader: true,
            resultsPosition: null,
        });
        const zIndex = gridGroupItem.getStickyHeaderZIndex();
        expect(zIndex).toBe(GROUP_Z_INDEX_DEFAULT);
    });
    it('getStickyHeaderZIndex with results', () => {
        const gridGroupItem = getGroupItem({
            hasHeader: false,
            resultsPosition: 'top',
        });
        const zIndex = gridGroupItem.getStickyHeaderZIndex();
        expect(zIndex).toBe(GROUP_Z_INDEX_DEFAULT);
    });
    it('getStickyHeaderZIndex without header and results', () => {
        const gridGroupItem = getGroupItem({
            hasHeader: false,
            resultsPosition: null,
        });
        const zIndex = gridGroupItem.getStickyHeaderZIndex();
        expect(zIndex).toBe(GROUP_Z_INDEX_WITHOUT_HEADERS_AND_RESULTS);
    });
});
