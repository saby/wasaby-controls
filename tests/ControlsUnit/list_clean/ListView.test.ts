import { ListView } from 'Controls/list';
import { Collection } from 'Controls/display';

describe('Controls/list_clean/ListView', () => {
    describe('controlResize', () => {
        const listViewCfg = {
            listModel: new Collection({
                collection: [],
                keyProperty: 'id',
            }),
            keyProperty: 'id',
        };
        let listView;

        beforeEach(() => {
            listView = new ListView(listViewCfg);
        });

        afterEach(() => {
            listView.destroy();
            listView = undefined;
        });

        describe('update subscription on viewModel change', () => {
            it('unsubscribe from old, subscribe to ne', () => {
                const newListModel = new Collection({
                    collection: [],
                    keyProperty: 'id',
                });

                listView._beforeMount(listViewCfg);

                const unsubscribeSpy = jest.spyOn(listView._listModel, 'unsubscribe').mockClear();
                const subscribeSpy = jest.spyOn(newListModel, 'subscribe').mockClear();

                listView._beforeUpdate({
                    ...listViewCfg,
                    listModel: newListModel,
                });

                expect(unsubscribeSpy).toHaveBeenCalled();
                expect(subscribeSpy).toHaveBeenCalled();

                jest.restoreAllMocks();
            });

            it('old view model destroyed', () => {
                const newListModel = new Collection({
                    collection: [],
                    keyProperty: 'id',
                });

                listView._beforeMount(listViewCfg);

                const unsubscribeSpy = jest.spyOn(listView._listModel, 'unsubscribe').mockClear();
                const subscribeSpy = jest.spyOn(newListModel, 'subscribe').mockClear();

                listView._listModel.destroy();
                listView._beforeUpdate({
                    ...listViewCfg,
                    listModel: newListModel,
                });

                expect(unsubscribeSpy).not.toHaveBeenCalled();
                expect(subscribeSpy).toHaveBeenCalled();

                jest.restoreAllMocks();
            });
        });
    });
});
