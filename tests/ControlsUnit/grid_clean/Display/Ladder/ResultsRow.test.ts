import { GridResultsRow } from 'Controls/grid';
import { getGridCollectionMock } from 'ControlsUnit/_listsUtils/mockOwner';

describe('Controls/grid_clean/Display/Ladder/ResultsRow', () => {
    describe('no grid support', () => {
        it('should not add sticky columns in table layout', () => {
            const columns = [{ title: 'firstColumn' }];
            const resultsRow = new GridResultsRow({
                owner: getGridCollectionMock({
                    gridColumnsConfig: columns,
                    isFullGridSupport: false,
                    stickyLadder: {
                        first: { ladderLength: 2 },
                    },
                    stickyLadderProperties: ['first'],
                }),
                columnsConfig: columns,
                gridColumnsConfig: columns,
            });

            const fakeFactoryMethod = (options) => {
                expect(options.ladderCell).not.toBe(true);
            };
            jest.spyOn(resultsRow, 'getColumnsFactory')
                .mockClear()
                .mockImplementation(() => {
                    return fakeFactoryMethod;
                });

            expect(Array.isArray(resultsRow.getColumns())).toBe(true);
            expect(resultsRow.getColumns().length).toEqual(1);
        });
    });
});
