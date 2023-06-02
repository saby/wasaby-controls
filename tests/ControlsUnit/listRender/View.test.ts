import View, { IViewOptions } from 'Controls/_listRender/View';
import { RecordSet } from 'Types/collection';

import { IItemActionsItem } from 'Controls/itemActions';

import 'Controls/display';
import { IStickyPopupOptions, Sticky } from 'Controls/popup';

describe('Controls/_listRender/View', () => {
    let items: RecordSet;
    let defaultCfg: IViewOptions;

    beforeEach(() => {
        items = new RecordSet({
            rawData: [{ id: 1 }, { id: 2 }, { id: 3 }],
            keyProperty: 'id',
        });
        defaultCfg = {
            items,
            collection: 'Controls/display:Collection',
            render: 'Controls/listRender:Render',
            contextMenuConfig: {
                iconSize: 's',
                groupProperty: 'title',
            },
        };
    });

    describe('_beforeMount()', () => {
        it('can create flat list collection', async () => {
            const cfg = {
                ...defaultCfg,
                collection: 'Controls/display:Collection',
            };
            const view = new View(cfg);
            await view._beforeMount(cfg);

            expect(view._collection).toBeTruthy();
            expect(view._collection._moduleName).toBe(cfg.collection);
        });
        it('wraps items recordset into the collection', async () => {
            const view = new View(defaultCfg);
            await view._beforeMount(defaultCfg);

            expect(view._collection.getSourceCollection()).toBe(
                defaultCfg.items
            );
        });

        it('passes received options to the collection', async () => {
            const cfg = {
                ...defaultCfg,
                displayProperty: 'my display property',
            };
            const view = new View(cfg);
            await view._beforeMount(cfg);

            expect(view._collection.getDisplayProperty()).toBe(
                cfg.displayProperty
            );
        });
    });

    describe('_beforeUpdate()', () => {
        it('recreates collection when given a new recordset', () => {
            const view = new View(defaultCfg);

            let oldCollectionDestroyed = false;
            view._collection = {
                destroy(): void {
                    oldCollectionDestroyed = true;
                },
            };

            const newCfg = {
                ...defaultCfg,
                items: defaultCfg.items.clone(),
            };
            view._beforeUpdate(newCfg);

            expect(oldCollectionDestroyed).toBe(true);
            expect(view._collection._moduleName).toBe(newCfg.collection);
            expect(view._collection.getSourceCollection()).toBe(newCfg.items);
        });

        it('does not recreate collection when given an old recordset', () => {
            const view = new View(defaultCfg);
            const collection = {
                getEditingConfig: () => {
                    return null;
                },
                setActionsTemplateConfig: () => {
                    return null;
                },
            };

            view._collection = collection;

            view.saveOptions(defaultCfg);
            view._beforeUpdate({ ...defaultCfg });

            expect(view._collection).toBe(collection);
        });
    });

    it('_beforeUnmount()', () => {
        const view = new View(defaultCfg);

        let oldCollectionDestroyed = false;
        view._collection = {
            destroy(): void {
                oldCollectionDestroyed = true;
            },
        };

        view._beforeUnmount();

        expect(oldCollectionDestroyed).toBe(true);
    });

    describe('Setting of item actions', () => {
        let view: View;
        let item: any;
        let fakeEvent: any;

        beforeEach(() => {
            view = new View(defaultCfg);
            item = {
                _$active: false,
                getContents: () => {
                    return {
                        getKey: () => {
                            return 2;
                        },
                    };
                },
                setActive() {
                    this._$active = true;
                },
                getActions: () => {
                    return {
                        all: [
                            {
                                id: 2,
                                showType: 0,
                            },
                        ],
                    };
                },
                isSwiped: () => {
                    return false;
                },
                isEditing: () => {
                    return false;
                },
            };
            view._collection = {
                _$activeItem: null,
                getEditingConfig: () => {
                    return null;
                },
                setActionsTemplateConfig: () => {
                    return null;
                },
                getItemBySourceKey: () => {
                    return item;
                },
                isEventRaising: () => {
                    return false;
                },
                setEventRaising: (val1, val2) => {
                    return null;
                },
                each: (val) => {
                    return null;
                },
                getViewIterator: (): any => {
                    return {
                        each: (callback) => {
                            return callback(item, 0);
                        },
                    };
                },
                setActiveItem(_item: any): void {
                    this._$activeItem = _item;
                },
                getActiveItem(): any {
                    return this._$activeItem;
                },
                at: () => {
                    return item;
                },
                find: () => {
                    return null;
                },
            };
            fakeEvent = {
                propagating: true,
                nativeEvent: {
                    prevented: false,
                    preventDefault(): void {
                        this.prevented = true;
                    },
                },
                stopImmediatePropagation(): void {
                    this.propagating = false;
                },
                target: {
                    getBoundingClientRect: () => {
                        return {
                            top: 100,
                            bottom: 100,
                            left: 100,
                            right: 100,
                            width: 100,
                            height: 100,
                        };
                    },
                    closest: () => {
                        return 'elem';
                    },
                },
            };
            const cfg = {
                ...defaultCfg,
                itemActions: [
                    {
                        id: 2,
                        showType: 0,
                    },
                ],
            };
            view._updateItemActions(cfg);
        });

        // Не показываем контекстное меню браузера, если мы должны показать кастомное меню
        it('should prevent default context menu', () => {
            const stubOpenPopup = jest
                .spyOn(Sticky, 'openPopup')
                .mockClear()
                .mockImplementation((config: IStickyPopupOptions) => {
                    return Promise.resolve('fake');
                });
            view._onItemContextMenu(null, item, fakeEvent);
            expect(fakeEvent.nativeEvent.prevented).toBe(true);
            expect(fakeEvent.propagating).toBe(false);
            stubOpenPopup.mockRestore();
        });

        // Должен устанавливать contextMenuConfig при инициализации itemActionsController
        it('should set contextMenuConfig to itemActionsController', async () => {
            let popupConfig;
            const stubOpenPopup = jest
                .spyOn(Sticky, 'openPopup')
                .mockClear()
                .mockImplementation((config: IStickyPopupOptions) => {
                    popupConfig = config;
                    return Promise.resolve(config);
                });
            await view._onItemContextMenu(null, item, fakeEvent);
            expect(popupConfig).toBeDefined();
            expect(popupConfig.templateOptions.groupProperty).toEqual('title');
            expect(popupConfig.templateOptions.iconSize).toEqual('s');

            view._closePopup();
            expect(view._itemActionsController.getActiveItem()).toBe(null);
            expect(view._itemActionsController.getSwipeItem()).toBe(null);
            stubOpenPopup.mockRestore();
        });

        it('should close menu on destroy', () => {
            view._itemActionsMenuId = 'fake';
            const stubClosePopup = jest
                .spyOn(Sticky, 'closePopup')
                .mockClear()
                .mockImplementation();
            view.destroy();
            expect(stubClosePopup).toHaveBeenCalled();
        });
    });

    describe('_itemActionsMenuCloseHandler()', () => {
        let stubClosePopup;
        let view: View;

        beforeEach(() => {
            view = new View(defaultCfg);
            view._collection = {
                _$activeItem: null,
                getEditingConfig: () => {
                    return null;
                },
                setActionsTemplateConfig: () => {
                    return null;
                },
                getItemBySourceKey: () => {
                    return item;
                },
                setActiveItem(_item) {
                    this._$activeItem = _item;
                },
                getActiveItem() {
                    return this._$activeItem;
                },
                at: () => {
                    return item;
                },
                find: () => {
                    return null;
                },
            };
            stubClosePopup = jest
                .spyOn(Sticky, 'closePopup')
                .mockClear()
                .mockImplementation();
        });

        // В случае клика вне меню и при нажатии на крестик нужно вызывать закрытие меню
        it('should call Sticky.closePopup method on close handler', () => {
            view._itemActionsMenuId = 'megaPopup';
            view._itemActionsController = {
                setActiveItem: jest.fn(),
                deactivateSwipe: jest.fn(),
            };
            view._itemActionsMenuCloseHandler(null, null);
            expect(stubClosePopup).toHaveBeenCalled();
        });
    });

    describe('marker', () => {
        const items = new RecordSet({
            rawData: [{ id: 1 }, { id: 2 }, { id: 3 }],
            keyProperty: 'id',
        });
        const cfg = {
            items,
            collection: 'Controls/display:Collection',
            render: 'Controls/listRender:Render',
            markerVisibility: 'visible',
            markedKey: 2,
        };
        let view;
        let notifySpy;
        beforeEach(() => {
            view = new View(cfg);
            notifySpy = jest.spyOn(view, '_notify').mockClear();
            return view._beforeMount(cfg).then(() => {
                expect(view._markerController).toBeTruthy();
            });
        });

        it('_beforeUpdate', () => {
            view.saveOptions(defaultCfg);
            view._beforeUpdate({ ...cfg, markedKey: 1 });

            expect(view._collection.getItemBySourceKey(1).isMarked()).toBe(
                true
            );
            expect(view._collection.getItemBySourceKey(2).isMarked()).toBe(
                false
            );
            expect(view._collection.getItemBySourceKey(3).isMarked()).toBe(
                false
            );
        });

        it('_onItemClick', () => {
            view._onItemClick({}, items.getRecordById(1), {});

            expect(view._collection.getItemBySourceKey(1).isMarked()).toBe(
                true
            );
            expect(view._collection.getItemBySourceKey(2).isMarked()).toBe(
                false
            );
            expect(view._collection.getItemBySourceKey(3).isMarked()).toBe(
                false
            );

            expect(notifySpy).toHaveBeenCalledWith(
                'beforeMarkedKeyChanged',
                [1],
                expect.anything()
            );
            expect(notifySpy).toHaveBeenCalledWith('markedKeyChanged', [1]);
        });

        it('_onItemActionMouseDown', () => {
            view._itemActionsController = {
                prepareActionsMenuConfig: jest.fn(),
            };

            view._onItemActionMouseDown(
                {},
                view._collection.getItemBySourceKey(1),
                null,
                {}
            );

            expect(view._collection.getItemBySourceKey(1).isMarked()).toBe(
                true
            );
            expect(view._collection.getItemBySourceKey(2).isMarked()).toBe(
                false
            );
            expect(view._collection.getItemBySourceKey(3).isMarked()).toBe(
                false
            );

            expect(notifySpy).toHaveBeenCalledWith(
                'beforeMarkedKeyChanged',
                [1],
                expect.anything()
            );
            expect(notifySpy).toHaveBeenCalledWith('markedKeyChanged', [1]);
        });

        it('_onItemKeyDown downKey', () => {
            const keyDownEvent = {
                nativeEvent: {
                    keyCode: 40,
                },
            };
            view._onItemKeyDown({}, null, keyDownEvent);

            expect(view._collection.getItemBySourceKey(1).isMarked()).toBe(
                false
            );
            expect(view._collection.getItemBySourceKey(2).isMarked()).toBe(
                false
            );
            expect(view._collection.getItemBySourceKey(3).isMarked()).toBe(
                true
            );

            expect(notifySpy).toHaveBeenCalledWith(
                'beforeMarkedKeyChanged',
                [3],
                expect.anything()
            );
            expect(notifySpy).toHaveBeenCalledWith('markedKeyChanged', [3]);
        });

        it('_onItemKeyDown upKey', () => {
            const keyDownEvent = {
                nativeEvent: {
                    keyCode: 38,
                },
            };
            view._onItemKeyDown({}, null, keyDownEvent);

            expect(view._collection.getItemBySourceKey(1).isMarked()).toBe(
                true
            );
            expect(view._collection.getItemBySourceKey(2).isMarked()).toBe(
                false
            );
            expect(view._collection.getItemBySourceKey(3).isMarked()).toBe(
                false
            );

            expect(notifySpy).toHaveBeenCalledWith(
                'beforeMarkedKeyChanged',
                [1],
                expect.anything()
            );
            expect(notifySpy).toHaveBeenCalledWith('markedKeyChanged', [1]);
        });
    });
});
