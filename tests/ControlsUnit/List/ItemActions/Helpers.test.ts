/**
 * Created by kraynovdo on 23.10.2017.
 */
import { ItemActionsHelpers as Helpers } from 'Controls/listDeprecate';
import { RecordSet } from 'Types/collection';

interface IData {
    id: number;
    parent: number;
    'parent@': boolean;
}

interface IAnotherData {
    id: number;
    parent1: number;
    'parent1@': boolean;
}

describe('Controls/List/ItemActions/Helpers', () => {
    describe('reorderMoveActionsVisibility', () => {
        let data: IData[];
        let rs: RecordSet;

        beforeEach(() => {
            data = [
                {
                    id: 1,
                    parent: null,
                    'parent@': true,
                },
                {
                    id: 2,
                    parent: 1,
                    'parent@': null,
                },
                {
                    id: 3,
                    parent: 1,
                    'parent@': null,
                },
                {
                    id: 4,
                    parent: null,
                    'parent@': true,
                },
                {
                    id: 5,
                    parent: 4,
                    'parent@': null,
                },
                {
                    id: 6,
                    parent: 4,
                    'parent@': null,
                },
                {
                    id: 7,
                    parent: null,
                    'parent@': true,
                },
                {
                    id: 8,
                    parent: null,
                    'parent@': null,
                },
            ];
            rs = new RecordSet({
                keyProperty: 'id',
                rawData: data,
            });
        });

        it('move first item up', () => {
            expect(Helpers.reorderMoveActionsVisibility('up', rs.at(0), rs)).toBe(false);
        });

        it('move first item down', () => {
            expect(Helpers.reorderMoveActionsVisibility('down', rs.at(0), rs)).toBe(true);
        });

        it('move last item down', () => {
            expect(Helpers.reorderMoveActionsVisibility('down', rs.at(rs.getCount() - 1), rs)).toBe(
                false
            );
        });

        it('move last item up', () => {
            expect(Helpers.reorderMoveActionsVisibility('up', rs.at(rs.getCount() - 1), rs)).toBe(
                true
            );
        });

        it('move first item up in folder', () => {
            expect(
                Helpers.reorderMoveActionsVisibility('up', rs.getRecordById(2), rs, 'parent')
            ).toBe(false);
        });

        it('move first item down in folder', () => {
            expect(
                Helpers.reorderMoveActionsVisibility('down', rs.getRecordById(2), rs, 'parent')
            ).toBe(true);
        });

        it('move last item down in folder', () => {
            expect(
                Helpers.reorderMoveActionsVisibility('down', rs.getRecordById(3), rs, 'parent')
            ).toBe(false);
        });

        it('move last item up in folder', () => {
            expect(
                Helpers.reorderMoveActionsVisibility('up', rs.getRecordById(3), rs, 'parent')
            ).toBe(true);
        });

        it('move folder down', () => {
            expect(
                Helpers.reorderMoveActionsVisibility(
                    'down',
                    rs.getRecordById(4),
                    rs,
                    'parent',
                    'parent@'
                )
            ).toBe(true);
        });

        it('move last folder down', () => {
            expect(
                Helpers.reorderMoveActionsVisibility(
                    'down',
                    rs.getRecordById(7),
                    rs,
                    'parent',
                    'parent@'
                )
            ).toBe(false);
        });

        it('change order list and list', () => {
            expect(
                Helpers.reorderMoveActionsVisibility(
                    'down',
                    rs.getRecordById(5),
                    rs,
                    'parent',
                    'parent@'
                )
            ).toBe(true);
        });

        it('append item', () => {
            const newItem = { id: 0, parent: null, 'parent@': null };
            const newItems = new RecordSet({
                keyProperty: 'id',
                rawData: [newItem],
            });

            // creating cached display
            Helpers.reorderMoveActionsVisibility('up', rs.getRecordById(1), rs);

            rs.append(newItems);

            expect(Helpers.reorderMoveActionsVisibility('down', rs.getRecordById(0), rs)).toBe(
                false
            );
            expect(Helpers.reorderMoveActionsVisibility('up', rs.getRecordById(0), rs)).toBe(true);
        });

        it('prepend item', () => {
            const newItem = { id: 0, parent: null, 'parent@': null };
            const newItems = new RecordSet({
                keyProperty: 'id',
                rawData: [newItem],
            });

            // creating cached display
            Helpers.reorderMoveActionsVisibility('up', rs.getRecordById(1), rs);

            rs.prepend(newItems);

            expect(Helpers.reorderMoveActionsVisibility('up', rs.getRecordById(0), rs)).toBe(false);
            expect(Helpers.reorderMoveActionsVisibility('down', rs.getRecordById(0), rs)).toBe(
                true
            );
        });

        it('in folder', () => {
            data = [
                {
                    id: 2,
                    parent: 1,
                    'parent@': null,
                },
                {
                    id: 3,
                    parent: 1,
                    'parent@': null,
                },
            ];
            rs = new RecordSet({
                keyProperty: 'id',
                rawData: data,
            });
            const root = 1;
            expect(
                Helpers.reorderMoveActionsVisibility(
                    'up',
                    rs.getRecordById(2),
                    rs,
                    'parent',
                    '',
                    root
                )
            ).toBe(false);
            expect(
                Helpers.reorderMoveActionsVisibility(
                    'down',
                    rs.getRecordById(2),
                    rs,
                    'parent',
                    '',
                    root
                )
            ).toBe(true);
            expect(
                Helpers.reorderMoveActionsVisibility(
                    'down',
                    rs.getRecordById(3),
                    rs,
                    'parent',
                    '',
                    root
                )
            ).toBe(false);
            expect(
                Helpers.reorderMoveActionsVisibility(
                    'up',
                    rs.getRecordById(3),
                    rs,
                    'parent',
                    '',
                    root
                )
            ).toBe(true);
        });

        it('change parentProperty + unsorted data', () => {
            const newData: IAnotherData[] = [
                {
                    id: 4,
                    parent1: 1,
                    'parent1@': null,
                },
                {
                    id: 1,
                    parent1: null,
                    'parent1@': true,
                },
                {
                    id: 6,
                    parent1: 5,
                    'parent1@': null,
                },
                {
                    id: 2,
                    parent1: 1,
                    'parent1@': null,
                },
                {
                    id: 5,
                    parent1: null,
                    'parent1@': true,
                },
                {
                    id: 3,
                    parent1: 1,
                    'parent1@': null,
                },
                {
                    id: 7,
                    parent1: 5,
                    'parent1@': null,
                },
            ];
            const newRs = new RecordSet({
                keyProperty: 'id',
                rawData: newData,
            });
            expect(
                Helpers.reorderMoveActionsVisibility('down', rs.getRecordById(6), rs, 'parent')
            ).toBe(false);
            expect(
                Helpers.reorderMoveActionsVisibility(
                    'down',
                    newRs.getRecordById(6),
                    newRs,
                    'parent1'
                )
            ).toBe(true);
        });

        it('with parentProperty, without _root, without parent in rs', () => {
            data = [
                {
                    id: 2,
                    parent: 1,
                    'parent@': null,
                },
                {
                    id: 3,
                    parent: 1,
                    'parent@': null,
                },
            ];
            rs = new RecordSet({
                keyProperty: 'id',
                rawData: data,
            });
            expect(
                Helpers.reorderMoveActionsVisibility('down', rs.getRecordById(2), rs, 'parent')
            ).toBe(true);
            expect(
                Helpers.reorderMoveActionsVisibility('up', rs.getRecordById(3), rs, 'parent')
            ).toBe(true);
        });
    });
});
