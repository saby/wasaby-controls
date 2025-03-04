import { CrudEntityKey } from 'Types/source';
import { FlatSiblingStrategy } from 'Controls/_baseList/Strategies/FlatSiblingStrategy';
import { ISiblingStrategy } from 'Controls/_baseList/interface/ISiblingStrategy';
import { Collection } from 'Controls/display';

describe('Controls/list_clean/Strategies/SiblingStrategy/Flat', () => {
    let strategy: ISiblingStrategy;

    const mockCollection = {
        getSourceCollection: () => {
            return {
                getIndexByValue: (keyProperty: string, key: CrudEntityKey) => {
                    return (key as number) - 1;
                },
                at: (index: number) => {
                    return index >= 0 && index <= 2
                        ? {
                              getKey: () => {
                                  return index + 1;
                              },
                          }
                        : undefined;
                },
                getKeyProperty: () => {
                    return 'id';
                },
            };
        },
    } as unknown as Collection;

    beforeEach(() => {
        strategy = new FlatSiblingStrategy({
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
