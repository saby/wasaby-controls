import { FilterResolver } from 'Controls/search';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';

describe('Controls/search:FilterResolver', () => {
    describe('getSwitchedStr', function () {
        it('Берем switchedStr из metaData.results', () => {
            const rs = new RecordSet({
                rawData: [],
                keyProperty: 'id',
            });
            rs.setMetaData({
                results: new Model({
                    rawData: {
                        switchedStr: 'testStr',
                    },
                }),
            });
            expect(FilterResolver.getSwitcherStrFromData(rs)).toEqual('testStr');
        });
        it('Берем switchedStr из meta', () => {
            const rs = new RecordSet({
                rawData: [],
                keyProperty: 'id',
            });
            rs.setMetaData({
                switchedStr: 'testStr',
            });
            expect(FilterResolver.getSwitcherStrFromData(rs)).toEqual('testStr');
        });
    });
});
