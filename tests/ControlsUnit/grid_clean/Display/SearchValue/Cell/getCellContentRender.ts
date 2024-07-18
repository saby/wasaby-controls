import Cell from 'Controls/_baseGrid/display/Cell';
import StringRender from 'Controls/_baseGrid/Render/types/StringRender';
import StringSearchRender from 'Controls/_baseGrid/Render/types/StringSearchRender';
import { getRowMock } from 'ControlsUnit/_listsUtils/mockOwner';

describe('Controls/_baseGrid/display/Cell/getCellContentRender', () => {
    let searchValue;
    let contents;

    const getCell = () => {
        return new Cell({
            owner: getRowMock({
                gridColumnsConfig: [{}],
                displayValue: 'title',
                searchValue,
                contents,
            }),
        });
    };

    beforeEach(() => {
        searchValue = '';
        contents = {};
    });

    it('exists display value', () => {
        contents.get = () => {
            return '1';
        };
        expect(getCell().getCellContentRender()).toEqual(StringRender);

        searchValue = '123';
        expect(getCell().getCellContentRender()).toEqual(StringSearchRender);
    });

    it('not exists display value', () => {
        expect(getCell().getCellContentRender()).toEqual(StringRender);

        searchValue = '123';
        expect(getCell().getCellContentRender()).toEqual(StringRender);
    });
});
