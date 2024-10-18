import { calculatePath } from 'Controls/dataSource';
import { RecordSet } from 'Types/collection';

describe('Controls/dataSource/calculatePath', () => {
    it('path is empty', () => {
        const pathOptions = calculatePath(new RecordSet(), 'caption');
        expect(pathOptions.path).toBeFalsy();
        expect(pathOptions.pathWithoutItemForBackButton).toBeFalsy();
        expect(pathOptions.backButtonCaption).toBeFalsy();
    });

    it('one item in path', () => {
        const path = new RecordSet({
            rawData: [
                {
                    key: 0,
                    caption: 'folder 0',
                },
            ],
        });
        const recordSet = new RecordSet();
        recordSet.setMetaData({
            path,
        });
        const pathOptions = calculatePath(recordSet, 'caption');
        expect(pathOptions.path).toHaveLength(1);
        expect(pathOptions.pathWithoutItemForBackButton).toBeNull();
        expect(pathOptions.backButtonCaption).toBe('folder 0');
    });

    it('two items in path', () => {
        const path = new RecordSet({
            rawData: [
                {
                    key: 0,
                    caption: 'folder 0',
                },
                {
                    key: 1,
                    caption: 'folder 1',
                },
            ],
        });
        const recordSet = new RecordSet();
        recordSet.setMetaData({
            path,
        });
        const pathOptions = calculatePath(recordSet, 'caption');
        expect(pathOptions.path).toHaveLength(2);
        expect(pathOptions.pathWithoutItemForBackButton).toHaveLength(1);
        expect(pathOptions.pathWithoutItemForBackButton[0].get('caption')).toBe('folder 0');
        expect(pathOptions.backButtonCaption).toBe('folder 1');
    });
});
