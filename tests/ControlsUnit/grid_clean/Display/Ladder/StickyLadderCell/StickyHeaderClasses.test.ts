import { Model } from 'Types/entity';
import { GridStickyLadderCell } from 'Controls/grid';
import { getDataRowMock } from 'ControlsUnit/_listsUtils/mockOwner';

const rawData = { key: 1, col1: 'c1-1', col2: 'с2-1', col3: 'с3-1' };
const column = { displayProperty: 'col1' };

describe('Controls/grid_clean/Display/Ladder/StickyLadderCell/StickyHeaderClasses', () => {
    let model: Model;

    beforeEach(() => {
        model = new Model({
            rawData,
            keyProperty: 'key',
        });
    });

    afterEach(() => {
        model = undefined;
    });

    const getLadderCell = (
        firstLadderLength: number,
        withHeaderGroupAndResults?: boolean
    ) => {
        return new GridStickyLadderCell({
            owner: getDataRowMock({
                gridColumnsConfig: [{}],
                stickyLadder: {
                    first: { ladderLength: firstLadderLength },
                    second: { ladderLength: 1 },
                },
                stickyLadderProperties: ['first', 'second'],
                hasHeader: !!withHeaderGroupAndResults,
                resultsPosition: withHeaderGroupAndResults ? 'top' : undefined,
                hasStickyGroup: !!withHeaderGroupAndResults,
            }),
            column,
        });
    };

    it('getStickyHeaderClasses without header, results, stickyGroup', () => {
        expect(getLadderCell(0).getStickyHeaderClasses()).toEqual(
            ' controls-Grid__row-cell__ladder-spacing'
        );
        expect(getLadderCell(1).getStickyHeaderClasses()).toEqual(
            ' controls-Grid__row-cell__ladder-main_spacing'
        );
    });
    it('getStickyHeaderClasses with header, results, stickyGroup', () => {
        expect(getLadderCell(0, true).getStickyHeaderClasses()).toEqual(
            ' controls-Grid__row-cell__ladder-spacing_withHeader_withResults_withGroup'
        );
        expect(getLadderCell(1, true).getStickyHeaderClasses()).toEqual(
            ' controls-Grid__row-cell__ladder-main_spacing_withGroup'
        );
    });
});
