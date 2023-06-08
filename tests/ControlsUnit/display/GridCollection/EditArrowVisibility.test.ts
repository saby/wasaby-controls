import { GridCollection } from 'Controls/grid';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { TEditArrowVisibilityCallback } from 'Controls/_grid/display/mixins/Grid';

describe('Controls/display/GridCollection/EditArrow', () => {
    let rs: RecordSet;
    let showEditArrow: boolean;
    let editArrowVisibilityCallback: TEditArrowVisibilityCallback;

    function initCollection(): GridCollection<Model> {
        return new GridCollection({
            collection: rs,
            keyProperty: 'id',
            showEditArrow,
            editArrowVisibilityCallback,
            columns: [
                {
                    width: '1fr',
                },
                {
                    width: '1px',
                },
                {
                    width: '1px',
                },
            ],
        });
    }

    beforeEach(() => {
        showEditArrow = true;
        editArrowVisibilityCallback = undefined;
        const items = [
            { id: 1, name: 'Ivan', surname: 'Kashitsyn' },
            { id: 2, name: 'Alexey', surname: 'Kudryavcev' },
            { id: 3, name: 'Olga', surname: 'Samokhvalova' },
        ];
        rs = new RecordSet({
            rawData: items,
            keyProperty: 'id',
        });
    });

    it('editArrowIsVisible === true when showEditArrow === true', () => {
        expect(initCollection().editArrowIsVisible(rs.at(0))).toBe(true);
    });

    it('editArrowIsVisible === false when showEditArrow === false', () => {
        showEditArrow = false;
        expect(initCollection().editArrowIsVisible(rs.at(0))).toBe(false);
    });

    it('should call editArrowVisibilityCallback', () => {
        editArrowVisibilityCallback = (item: Model) => {
            return item.getKey() !== 1;
        };
        expect(initCollection().editArrowIsVisible(rs.at(0))).toBe(false);
        expect(initCollection().editArrowIsVisible(rs.at(1))).toBe(true);
    });
});
