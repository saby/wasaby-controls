import { GridCollection } from 'Controls/grid';
import { RecordSet } from 'Types/collection';

describe('Controls/grid_clean/display/GridCollection/', () => {
    const items = [
        { id: 1, name: 'Ivan' },
        { id: 2, name: 'Alexey' },
        { id: 3, name: 'Olga' },
    ];

    let display: GridCollection;
    let rs;
    beforeEach(() => {
        rs = new RecordSet({
            rawData: items,
            keyProperty: 'id',
        });
        display = new GridCollection({
            collection: rs,
            columns: [],
        });
    });

    it('change items version', () => {
        const curVersion = display.getItems().map((it) => {
            return it.getVersion();
        });
        rs.setEventRaising(true);

        rs.at(0).set('name', 'Ivan1');
        rs.at(1).set('name', 'Alexey1');
        rs.at(2).set('name', 'Olga1');

        rs.setEventRaising(false);

        for (let i = 0; i < display.getItems().length; i++) {
            expect(display.at(i).getVersion()).toEqual(curVersion[i] + 1);
        }
    });
});
