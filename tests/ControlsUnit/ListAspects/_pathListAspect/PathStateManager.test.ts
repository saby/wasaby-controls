import { RecordSet } from 'Types/collection';
import { pathStateManagerFactory, IPathState } from 'Controls/listAspects';
import { Model } from 'Types/entity';

describe('Controls/_listAspects/_pathListAspect', () => {
    const PathStateManager = pathStateManagerFactory();

    test('should works correctly when prevState.items is empty', () => {
        const keyProperty = 'id';
        const displayProperty = 'title';
        const breadCrumbsItems: Model[] = [];
        const breadCrumbsItemsWithoutBackButton: Model[] = [];
        const backButtonCaption = '';
        const prevState: IPathState = {
            items: undefined as unknown as RecordSet,
            breadCrumbsItems,
            breadCrumbsItemsWithoutBackButton,
            backButtonCaption,
            displayProperty,
            keyProperty,
        };
        const nextState: IPathState = {
            items: new RecordSet(),
            breadCrumbsItems,
            breadCrumbsItemsWithoutBackButton,
            backButtonCaption,
            displayProperty,
            keyProperty,
        };
        nextState.items.setMetaData({
            path: new RecordSet({
                rawData: [
                    { id: 1, title: 'first' },
                    { id: 2, title: 'second' },
                ],
            }),
        });
        const changes = PathStateManager.resolveChanges(prevState, nextState);
        expect(changes).not.toEqual([]);
    });
});
