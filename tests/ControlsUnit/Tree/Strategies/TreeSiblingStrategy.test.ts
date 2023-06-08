import { CrudEntityKey } from 'Types/source';
import { TreeSiblingStrategy } from 'Controls/baseTree';
import { ISiblingStrategy } from 'Controls/_baseList/interface/ISiblingStrategy';
import { Tree } from 'Controls/baseTree';

describe('Controls/list_clean/Strategies/SiblingStrategy/Tree', () => {
    let strategy: ISiblingStrategy;

    const mockModel = (id: number) => {
        return {
            getKey: () => {
                return id;
            },
            get: () => {
                return null;
            },
        };
    };
    const mockItem = (id: number) => {
        return {
            contents: mockModel(id),
        };
    };

    const mockCollection = {
        getParentProperty: () => {
            return 'parent';
        },
        getChildrenByRecordSet: (parent: CrudEntityKey) => {
            return [mockItem(1), mockItem(2), mockItem(3)];
        },
        getItemBySourceKey: (key) => {
            return {
                getParent: () => {
                    return {
                        getKey: () => {
                            return key;
                        },
                        get: () => {
                            return null;
                        },
                    };
                },
            };
        },
    } as unknown as Tree;

    beforeEach(() => {
        strategy = new TreeSiblingStrategy({
            collection: mockCollection,
        });
    });

    it('returns next record', () => {
        expect(strategy.getNextByKey(2).getKey()).toEqual(3);
    });

    it('returns previous record', () => {
        expect(strategy.getPrevByKey(2).getKey()).toEqual(1);
    });

    it('returns undefined for last', () => {
        expect(strategy.getNextByKey(3)).toEqual(undefined);
    });

    it('returns undefined for first', () => {
        expect(strategy.getPrevByKey(1)).toEqual(undefined);
    });
});
