import { GridCell, GridRow } from 'Controls/grid';
import { Model } from 'Types/entity';
import { getRowMock } from 'ControlsUnit/_listsUtils/mockOwner';

describe('Controls/grid/Display/Cell/stickyBackgroundStyle', () => {
    let cell: GridCell<Model, GridRow<Model>>;
    const owner = getRowMock({
        gridColumnsConfig: [{}],
    }) as undefined as GridRow<Model>;

    beforeEach(() => {
        cell = null;
    });

    it('style=default, backgroundstyle=default', () => {
        cell = new GridCell({
            owner,
            column: { width: '' },
            backgroundStyle: 'default',
            style: 'default',
        });
        expect(cell.getStickyBackgroundStyle()).toEqual('default');
    });
    it('style=default, backgroundstyle!=default', () => {
        cell = new GridCell({
            owner,
            column: { width: '' },
            backgroundStyle: 'red',
            style: 'default',
        });
        expect(cell.getStickyBackgroundStyle()).toEqual('red');
    });
    it('style!=default, backgroundstyle!=default', () => {
        cell = new GridCell({
            owner,
            column: { width: '' },
            backgroundStyle: 'red',
            style: 'blue',
        });
        expect(cell.getStickyBackgroundStyle()).toEqual('red');
    });
    it('style!=default, backgroundstyle=default', () => {
        cell = new GridCell({
            owner,
            column: { width: '' },
            backgroundStyle: 'default',
            style: 'blue',
        });
        expect(cell.getStickyBackgroundStyle()).toEqual('blue');
    });
});
