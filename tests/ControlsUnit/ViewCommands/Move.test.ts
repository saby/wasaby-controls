import { Move } from 'Controls/viewCommands';
import { RecordSet } from 'Types/collection';
import { LOCAL_MOVE_POSITION as MOVE_POSITION } from 'Types/source';

describe('Controls/viewCommands:Move', () => {
    const options = {
        keyProperty: 'key',
        parentProperty: 'parent',
        nodeProperty: 'node',
    };
    const items = new RecordSet({
        rawData: [
            { key: '1', parent: null, node: true },
            { key: '2', parent: null, node: true },
            { key: '3', parent: '1', node: null },
            { key: '4', parent: '1', node: true },
            { key: '5', parent: '4', node: true },
            { key: '6', parent: '5', node: true },
            { key: '7', parent: '6', node: null },
            { key: '8', parent: '2', node: null },
            { key: '9', parent: '2', node: null },
            { key: '10', parent: '2', node: true },
            { key: '11', parent: '2', node: null },
            { key: '12', parent: '10', node: null },
        ],
        keyProperty: 'key',
    });
    it('Hierarchy move to root', () => {
        const command = new Move({
            ...options,
            items: ['1'],
            root: null,
            collection: items,
            direction: MOVE_POSITION.On,
            target: null,
        });
        command.execute();
        expect(items.getRecordById('1').get('parent')).toEqual(null);
    });
});
