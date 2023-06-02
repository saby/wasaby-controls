import { TreeCollection, TreeItem } from 'Controls/tree';
import { CssClassesAssert } from 'ControlsUnit/CustomAsserts';
import { RecordSet } from 'Types/collection';

describe('Controls/_tree/display/TreeItem', () => {
    describe('.getContentsClasses()', () => {
        it('default', () => {
            const owner = new TreeCollection({
                collection: new RecordSet({
                    keyProperty: 'id',
                }),
                keyProperty: 'id',
            });
            const item = new TreeItem({ owner });
            CssClassesAssert.include(
                item.getContentClasses(),
                'controls-Tree__itemContent'
            );
        });
    });
});
