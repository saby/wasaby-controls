import { RecordSet } from 'Types/collection';
import { Collection, CollectionItem } from 'Controls/display';
import { ICollection } from '../../../Controls/_display/interface/ICollection';
import { CssClassesAssert } from 'ControlsUnit/CustomAsserts';
import { Model } from 'Types/entity';

interface IChangedData<T> {
    item?: CollectionItem<T>;
    property?: string;
}

describe('Controls/_display/CollectionItem', () => {
    describe('.getOwner()', () => {
        it('should return null by default', () => {
            const item = new CollectionItem();
            expect(item.getOwner()).toBeNull();
        });

        it('should return value passed to the constructor', () => {
            const owner = {};
            const item = new CollectionItem({ owner: owner as any });

            expect(item.getOwner()).toBe(owner);
        });
    });

    describe('.setOwner()', () => {
        it('should set the new value', () => {
            const owner = {};
            const item = new CollectionItem();

            item.setOwner(owner as any);

            expect(item.getOwner()).toBe(owner);
        });
    });

    describe('.getContents()', () => {
        it('should return null by default', () => {
            const item = new CollectionItem();
            expect(item.getContents()).toBeNull();
        });

        it('should return value passed to the constructor', () => {
            const contents = {};
            const item = new CollectionItem({ contents });

            expect(item.getContents()).toBe(contents);
        });
    });

    describe('.setContents()', () => {
        it('should set the new value', () => {
            const contents = {};
            const item = new CollectionItem();

            item.setContents(contents);

            expect(item.getContents()).toBe(contents);
        });

        it('should notify the owner', () => {
            const newContents = 'new';
            const given: IChangedData<string> = {};
            const owner = {
                notifyItemChange(item: CollectionItem<string>, property: string): void {
                    given.item = item;
                    given.property = property;
                },
            };
            const item = new CollectionItem({ owner: owner as any });

            item.setContents(newContents);

            expect(given.item).toBe(item);
            expect(given.property).toBe('contents');
        });

        it('should not notify the owner', () => {
            const newContents = 'new';
            const given: IChangedData<string> = {};
            const owner = {
                notifyItemChange(item: CollectionItem<string>, property: string): void {
                    given.item = item;
                    given.property = property;
                },
            };
            const item = new CollectionItem({ owner: owner as any });

            item.setContents(newContents, true);

            expect(given.item).not.toBeDefined();
            expect(given.property).not.toBeDefined();
        });
    });

    describe('.getUid()', () => {
        it('should return calling result of getItemUid() on owner', () => {
            const owner = {
                getItemUid: (item) => {
                    return `[${item.getContents()}]`;
                },
            };
            const item = new CollectionItem({
                owner: owner as any,
                contents: 'foo',
            });

            expect(item.getUid()).toEqual('[foo]');
        });

        it('should return undefined if there is no owner', () => {
            const item = new CollectionItem();
            expect(item.getUid()).not.toBeDefined();
        });
    });

    describe('.isSelected()', () => {
        it('should return false by default', () => {
            const item = new CollectionItem();
            expect(item.isSelected()).toBe(false);
        });

        it('should return value passed to the constructor', () => {
            const selected = true;
            const item = new CollectionItem({ selected });

            expect(item.isSelected()).toBe(selected);
        });
    });

    describe('.setSelected()', () => {
        it('should set the new value', () => {
            const selected = true;
            const item = new CollectionItem();

            item.setSelected(selected);

            expect(item.isSelected()).toBe(selected);
        });

        it('should notify the owner', () => {
            const given: IChangedData<string> = {};
            const owner = {
                notifyItemChange(item: CollectionItem<string>, property: string): void {
                    given.item = item;
                    given.property = property;
                },
            };

            const item = new CollectionItem({ owner: owner as any });
            item.setSelected(true);

            expect(given.item).toBe(item);
            expect(given.property).toBe('selected');
        });

        it('should not notify the owner', () => {
            const given: IChangedData<string> = {};
            const owner = {
                notifyItemChange(item: CollectionItem<string>, property: string): void {
                    given.item = item;
                    given.property = property;
                },
            };

            const item = new CollectionItem({ owner: owner as any });
            item.setSelected(true, true);

            expect(given.item).not.toBeDefined();
            expect(given.property).not.toBeDefined();
        });
    });

    // TODO используются методы _getOptions из миксина OptionsToProperty. Раскоментировать когда будет актуально
    /*
        describe('.toJSON()', () => {
            it('should serialize the collection item', () => {
                const item = new CollectionItem();
                const json = item.toJSON();
                const options = (item as any)._getOptions();

                delete options.owner;

                expect(json.module).toBe('Controls/display:CollectionItem');
                expect(typeof json.id).toBe('number');
                expect(json.id > 0).toBe(true);
                expect(json.state.$options).toEqual(options);
                expect((json.state as any).iid).toBe(item.getInstanceId());
            });

            it('should serialize contents of the item if owner is not defined', () => {
                const items = [1];
                (items as any).getIndex = Array.prototype.indexOf;
                const owner = {
                    getCollection(): number[] {
                        return items;
                    }
                };

                const item = new CollectionItem({
                    owner: owner as any,
                    contents: 'foo'
                });
                const json = item.toJSON();

                expect((json.state as any).ci).not.toBeDefined();
                expect(json.state.$options.contents).toEqual('foo');
            });

            it('should serialize contents of the item if owner doesn\'t supports IList', () => {
                const items = [1];
                const owner = {
                    getCollection(): number[] {
                        return items;
                    }
                };

                const item = new CollectionItem({
                    owner: owner as any,
                    contents: 'foo'
                });
                const json = item.toJSON();

                expect((json.state as any).ci).not.toBeDefined();
                expect(json.state.$options.contents).toEqual('foo');
            });

            it('should don\'t serialize contents of the item if owner supports IList', () => {
                const items = [1];
                const owner = {
                    getCollection(): number[] {
                        return items;
                    }
                };
                items['[Types/_collection/IList]'] = true;
                (items as any).getIndex = Array.prototype.indexOf;

                const item = new CollectionItem({
                    owner: owner as any,
                    contents: items[0]
                });
                const json = item.toJSON();

                expect((json.state as any).ci).toBe(0);
                expect(json.state.$options.contents).not.toBeDefined();
            });
        });
    */

    it('.getDisplayProperty()', () => {
        const owner = {
            getDisplayProperty(): string {
                return 'myDisplayProperty';
            },
        };

        const item = new CollectionItem({ owner });

        expect(item.getDisplayProperty()).toBe('myDisplayProperty');
    });

    it('.setMarked()', () => {
        const given: IChangedData<string> = {};
        const owner = {
            notifyItemChange(item: CollectionItem<string>, property: string): void {
                given.item = item;
                given.property = property;
            },
        };

        const item = new CollectionItem({ owner });
        expect(item.isMarked()).toBe(false);

        const prevVersion = item.getVersion();

        item.setMarked(true);
        expect(item.isMarked()).toBe(true);
        expect(item.getVersion()).toBeGreaterThan(prevVersion);

        expect(given.item).toBe(item);
        expect(given.property).toBe('marked');
    });

    describe('actions', () => {
        let given: IChangedData<string>;
        const owner = {
            getEditingConfig(): object {
                return {
                    toolbarVisibility: true,
                };
            },
            notifyItemChange(item: CollectionItem<string>, property: string): void {
                given.item = item;
                given.property = property;
            },
            getItemActionsPosition: () => {
                return 'default';
            },
        };

        beforeEach(() => {
            given = {};
        });

        it('.setActions()', () => {
            const item = new CollectionItem({ owner });
            const actions = {};
            const prevVersion = item.getVersion();

            item.setActions(actions);

            expect(item.getActions()).toBe(actions);
            expect(item.getVersion()).toBeGreaterThan(prevVersion);

            expect(given.item).toBe(item);
            expect(given.property).toBe('actions');
        });

        it('.hasVisibleActions()', () => {
            const item = new CollectionItem({ owner });
            const actions = {
                all: [{ id: 1 }, { id: 2 }, { id: 3 }],
                showed: [],
            };

            item.setActions(actions);
            expect(item.hasVisibleActions()).toBe(false);

            const newActions = {
                ...actions,
                showed: [{ id: 1 }],
            };

            item.setActions(newActions);
            expect(item.hasVisibleActions()).toBe(true);
        });

        it('.hasActionWithIcon()', () => {
            const item = new CollectionItem({ owner });
            const actions = {
                all: [{ id: 1 }, { id: 2 }, { id: 3 }],
                showed: [],
            };

            item.setActions(actions);
            expect(item.hasActionWithIcon()).toBe(false);

            const newActions = {
                ...actions,
                showed: [{ id: 1 }],
            };

            item.setActions(newActions);
            expect(item.hasActionWithIcon()).toBe(false);

            const actionsWithIcon = {
                ...newActions,
                showed: [...newActions.showed, { id: 2, icon: 'phone' }],
            };

            item.setActions(actionsWithIcon);
            expect(item.hasActionWithIcon()).toBe(true);
        });

        describe('.shouldDisplayItemActions()', () => {
            it('displays actions when there are showed actions', () => {
                const item = new CollectionItem({ owner });
                const actions = {
                    all: [{ id: 1 }, { id: 2 }, { id: 3 }],
                    showed: [],
                };

                item.setActions(actions);
                expect(item.shouldDisplayItemActions()).toBe(false);

                // has showed actions
                const newActions = {
                    ...actions,
                    showed: [{ id: 1 }],
                };

                item.setActions(newActions);
                expect(item.shouldDisplayItemActions()).toBe(true);
            });

            it('displays actions in edit mode (toolbar)', () => {
                const item = new CollectionItem({ owner });
                const actions = {
                    all: [{ id: 1 }, { id: 2 }, { id: 3 }],
                    showed: [],
                };

                // has no showed actions, but is editing
                item.setActions(actions);
                item.setEditing(true);

                expect(item.shouldDisplayItemActions()).toBe(true);
            });
        });
    });

    describe('isSwiped variants', () => {
        let given: IChangedData<string>;
        let owner: ICollection<any, CollectionItem<any>>;
        let item: CollectionItem<any>;
        beforeEach(() => {
            given = {};
            owner = {
                _swipeAnimation: null,
                notifyItemChange(item: CollectionItem<string>, property: string): void {
                    given.item = item;
                    given.property = property;
                },
                getSwipeAnimation() {
                    return this._swipeAnimation;
                },
                setSwipeAnimation(animation) {
                    this._swipeAnimation = animation;
                },
            };
            item = new CollectionItem({ owner });
        });

        // Версия должна измениться после setSwiped()
        it("should update item's version on setSwiped()", () => {
            const prevVersion = item.getVersion();
            item.setSwiped(true);
            expect(item.getVersion()).toBeGreaterThan(prevVersion);
        });

        // Модельдолжна сообщить корректное событие после setSwiped()
        it('should fire change event on setSwiped()', () => {
            item.setSwiped(true);
            expect(given.item).toBe(item);
            expect(given.property).toBe('swiped');
        });

        // isSwiped() должен вернуть true, тогда и только тогда когда анимация выставлена в close/open
        it('isSwiped() should only be true when item is swiped', () => {
            item.setSwiped(true);
            expect(!!item.isAnimatedForSelection()).toBe(false);
            expect(!!item.isSwiped()).toBe(true);
        });

        // isAnimatedForSelection() должен вернуть true, тогда и только тогда когда анимация выставлена в right-swipe
        it('isAnimatedForSelection() should only be true when item is right-swiped', () => {
            item.setAnimatedForSelection(true);
            expect(!!item.isAnimatedForSelection()).toBe(true);
            expect(!!item.isSwiped()).toBe(false);
        });
    });

    it('.setActive()', () => {
        const given: IChangedData<string> = {};
        const owner = {
            notifyItemChange(item: CollectionItem<string>, property: string): void {
                given.item = item;
                given.property = property;
            },
            getHoverBackgroundStyle: jest.fn(),
        };

        const item = new CollectionItem({ owner });
        expect(item.isActive()).toBe(false);

        const prevVersion = item.getVersion();

        item.setActive(true);
        expect(item.isActive()).toBe(true);
        expect(item.getVersion()).toBeGreaterThan(prevVersion);

        expect(given.item).toBe(item);
        expect(given.property).toBe('active');
    });

    it('.getWrapperClasses()', () => {
        const owner = {
            notifyItemChange: jest.fn(),
            getHoverBackgroundStyle: jest.fn(),
            getEditingBackgroundStyle: () => {
                return 'default';
            },
            isFirstItem: () => {
                return false;
            },
            isLastItem: () => {
                return false;
            },
            getNavigation: () => {
                return {};
            },
        };

        const defaultClasses = [
            'controls-ListView__itemV',
            'controls-ListView__item_default',
            'controls-ListView__item_showActions',
            'js-controls-ListView__measurableContainer',
        ];
        const editingClasses = ['controls-background-editing'];

        const item = new CollectionItem({ owner });
        const wrapperClasses = item.getWrapperClasses();

        defaultClasses.forEach((className) => {
            return expect(wrapperClasses).toContain(className);
        });
        editingClasses.forEach((className) => {
            return expect(wrapperClasses).not.toContain(className);
        });

        item.setEditing(true, true);
        const editingWrapperClasses = item.getWrapperClasses();

        defaultClasses.concat(editingClasses).forEach((className) => {
            expect(editingWrapperClasses).toContain(className);
        });
    });

    it('.getContentClasses()', () => {
        const owner = {
            getTopPadding(): string {
                return '#topSpacing#';
            },
            getBottomPadding(): string {
                return '#bottomSpacing#';
            },
            getLeftPadding(): string {
                return '#leftSpacing#';
            },
            getRightPadding(): string {
                return '#rightSpacing#';
            },
            getMultiSelectVisibility: () => {
                return undefined;
            },
            getMultiSelectPosition(): string {
                return 'default';
            },
            getRowSeparatorSize() {
                return '';
            },
            isLastItem() {
                return false;
            },
            getNavigation() {
                return {
                    view: 'page',
                };
            },
            notifyItemChange() {
                return null;
            },
        };
        const defaultClasses = [
            'controls-ListView__itemContent',
            'controls-ListView__item_default-topPadding_#topspacing#',
            'controls-ListView__item_default-bottomPadding_#bottomspacing#',
            'controls-ListView__item-rightPadding_#rightspacing#',
        ];

        const item = new CollectionItem({
            owner,
            multiSelectVisibility: 'visible',
        });

        // multiselect visible
        const visibleContentClasses = item.getContentClasses();
        defaultClasses
            .concat(['controls-ListView__itemContent_withCheckboxes'])
            .forEach((className) => {
                return expect(visibleContentClasses).toContain(className);
            });

        // multiselect hidden
        item.setMultiSelectVisibility('hidden');
        const hiddenContentClasses = item.getContentClasses();
        defaultClasses
            .concat(['controls-ListView__item-leftPadding_#leftspacing#'])
            .forEach((className) => {
                return expect(hiddenContentClasses).toContain(className);
            });
    });

    it('.getMultiSelectClasses()', () => {
        const owner = {
            getMultiSelectPosition(): string {
                return 'default';
            },
        };

        const item = new CollectionItem({
            owner,
            multiSelectVisibility: 'onhover',
        });
        const requiredClasses =
            'js-controls-ListView__notEditable ' +
            'js-controls-ListView__checkbox ' +
            'js-controls-DragScroll__notDraggable ' +
            'controls-List_DragNDrop__notDraggable ' +
            'controls-ListView__checkbox ' +
            'controls-CheckboxMarker_inList';

        // multiselect onhover + not selected
        item.setMultiSelectVisibility('onhover');
        let onhoverMultiSelectClasses = item.getMultiSelectClasses('default');
        CssClassesAssert.isSame(
            onhoverMultiSelectClasses,
            requiredClasses +
                ' controls-ListView__checkbox_marginTop_s controls-ListView__checkbox_position-default' +
                ' controls-ListView__checkbox-onhover controls-cursor_pointer'
        );

        // multiselect onhover + not selected + readOnly
        item.isReadonlyCheckbox = () => {
            return true;
        };
        onhoverMultiSelectClasses = item.getMultiSelectClasses('default');
        CssClassesAssert.isSame(
            onhoverMultiSelectClasses,
            requiredClasses +
                ' controls-ListView__checkbox_marginTop_s controls-ListView__checkbox_position-default' +
                ' controls-ListView__checkbox-onhover '
        );
        item.isReadonlyCheckbox = () => {
            return false;
        };

        // multiselect onhover + selected
        item.setSelected(true, true);
        const selectedMultiSelectClasses = item.getMultiSelectClasses('default');
        CssClassesAssert.isSame(
            selectedMultiSelectClasses,
            requiredClasses +
                ' controls-ListView__checkbox_marginTop_s controls-ListView__checkbox_position-default' +
                ' controls-cursor_pointer'
        );

        // multiselect onhover + partial selection
        item.setSelected(null, true);
        const partSelectedMultiSelectClasses = item.getMultiSelectClasses('default');
        CssClassesAssert.isSame(
            partSelectedMultiSelectClasses,
            requiredClasses +
                ' controls-ListView__checkbox_marginTop_s controls-ListView__checkbox_position-default' +
                ' controls-cursor_pointer'
        );

        // custom position
        owner.getMultiSelectPosition = () => {
            return 'custom';
        };
        const customMultiSelectClasses = item.getMultiSelectClasses('default');
        CssClassesAssert.isSame(
            customMultiSelectClasses,
            requiredClasses + ' controls-ListView__checkbox_position-custom controls-cursor_pointer'
        );
    });

    describe('.setEditing()', () => {
        it('sets the editing flag and updates the version', () => {
            const given: IChangedData<string> = {};
            const owner = {
                notifyItemChange(item: CollectionItem<string>, property: string): void {
                    given.item = item;
                    given.property = property;
                },
            };

            const item = new CollectionItem({ owner });
            expect(item.isEditing()).toBe(false);

            const prevVersion = item.getVersion();

            item.setEditing(true);
            expect(item.isEditing()).toBe(true);
            expect(item.getVersion()).toBeGreaterThan(prevVersion);

            expect(given.item).toBe(item);
            expect(given.property).toBe('editing');
        });

        it('should apply all versions update after cancel editing', () => {
            const contents = new Model({
                keyProperty: 'id',
                rawData: { id: 1, title: '' },
            });
            const item = new CollectionItem({ contents });

            expect(item.getVersion()).toEqual(0);
            item.setEditing(true, contents);
            expect(item.getVersion()).toEqual(1);

            contents.set('title', '1'); // +3
            contents.set('title', '12'); // +3
            contents.set('title', '123'); // +3

            expect(item.getVersion()).toEqual(10);

            item.setEditing(false);

            expect(item.getVersion()).toEqual(11);
        });

        it('returns the editing contents as the contents in edit mode', () => {
            const originalContents = { id: 1, _original: true };
            const editingContents = { id: 1, _editing: true };

            const item = new CollectionItem({ contents: originalContents });
            item.setEditing(true, editingContents, true);

            expect(item.getContents()).toBe(editingContents);

            item.setEditing(false, null, true);

            expect(item.getContents()).toBe(originalContents);
        });

        it('notifies owner when editing contents change', () => {
            const given: IChangedData<string> = {};
            const owner = {
                notifyItemChange(item: CollectionItem<string>, property: string): void {
                    given.item = item;
                    given.property = property;
                },
            };
            const editingContents = {
                '[Types/_entity/ObservableMixin]': true,
                id: 1,
                _editing: true,
                _propertyChangedHandler: null,
                subscribe(eventName, handler): void {
                    if (eventName === 'onPropertyChange') {
                        this._propertyChangedHandler = handler;
                    }
                },
            };

            const item = new CollectionItem({ owner });
            item.setEditing(true, editingContents);

            expect(typeof editingContents._propertyChangedHandler).toBe('function');

            // emulate property changing and onPropertyChange firing
            editingContents._propertyChangedHandler.call(item);

            expect(given.item).toBe(item);
            expect(given.property).toBe('editingContents');
        });

        it('unsubscribes from editing contents property change when editing is finished', () => {
            const given: IChangedData<string> = {};
            const owner = {
                notifyItemChange(item: CollectionItem<string>, property: string): void {
                    given.item = item;
                    given.property = property;
                },
            };
            const editingContents = {
                '[Types/_entity/ObservableMixin]': true,
                id: 1,
                _editing: true,
                _propertyChangedHandler: null,
                subscribe(eventName, handler): void {
                    if (eventName === 'onPropertyChange') {
                        this._propertyChangedHandler = handler;
                    }
                },
                unsubscribe(eventName, handler): void {
                    if (
                        eventName === 'onPropertyChange' &&
                        this._propertyChangedHandler === handler
                    ) {
                        this._propertyChangedHandler = null;
                    }
                },
            };

            const item = new CollectionItem({ owner });
            item.setEditing(true, editingContents);
            item.setEditing(false);

            expect(editingContents._propertyChangedHandler).toBeNull();
        });

        it('increases item version when editing contents version is increased', () => {
            const editingContents = {
                _version: 0,
                getVersion(): number {
                    return this._version;
                },
            };

            const item = new CollectionItem();
            item.setEditing(true, editingContents, true);

            const prevVersion = item.getVersion();
            editingContents._version++;

            expect(item.getVersion()).toBeGreaterThan(prevVersion);
        });

        it('show checkbox for editing item', () => {
            const editingItem = new CollectionItem({
                editing: true,
            });
            expect(editingItem.isVisibleCheckbox()).toBe(true);
        });

        it('hide checkbox for adding item', () => {
            const addingItem = new CollectionItem({ isAdd: true });
            expect(addingItem.isVisibleCheckbox()).toBe(false);
        });
    });

    describe('testing of ICollectionItemStyled styling methods', () => {
        let item: CollectionItem<any>;

        beforeEach(() => {
            item = new CollectionItem();
            item.setOwner(
                new Collection({
                    keyProperty: 'id',
                    collection: new RecordSet({
                        rawData: [item],
                        keyProperty: 'id',
                    }) as any,
                })
            );
        });

        // CSS класс для позиционирования опций записи.

        // Если itemPadding.top === null и itemPadding.bottom === null, то возвращает пустую строку (новая модель)
        // eslint-disable-next-line max-len
        it('getItemActionPositionClasses() should return empty string when itemPadding = {top: null, bottom: null}', () => {
            item.getOwner().setItemPadding({ top: 'null', bottom: 'null' });
            const result = item.getItemActionPositionClasses('inside', null);
            expect(result).toEqual(' controls-itemActionsV_position_bottomRight ');
        });

        // Если опции внутри строки и itemActionsClass не задан, возвращает класс, добавляющий выравнивание bottomRight
        it('getItemActionPositionClasses() should return classes for bottom-right positioning when itemActionClass is not set', () => {
            item.getOwner().setItemPadding({ top: 'null', bottom: 's' });
            const result = item.getItemActionPositionClasses('inside', null);
            expect(result).toEqual(
                ' controls-itemActionsV_position_bottomRight controls-itemActionsV_padding-bottom_default '
            );
        });

        // eslint-disable-next-line max-len
        // Если опции внутри строки и itemActionsClass задан, возвращает класс, добавляющий выравнивание согласно itemActionsClass и itemPadding
        it('getItemActionPositionClasses() should return classes for bottom-right positioning when itemActionClass is set', () => {
            item.getOwner().setItemPadding({ top: 'null', bottom: 's' });
            const result = item.getItemActionPositionClasses(
                'inside',
                'controls-itemActionsV_position_topRight'
            );
            expect(result).toEqual(
                ' controls-itemActionsV_position_topRight controls-itemActionsV_padding-top_null '
            );
        });

        // Если новая модель, то в любом случае не считается класс, добавляющий padding
        it('getItemActionPositionClasses() should not add padding class', () => {
            item.getOwner().setItemPadding({ top: 's', bottom: 's' });
            const result = item.getItemActionPositionClasses('inside', null);
            expect(result).toEqual(
                ' controls-itemActionsV_position_bottomRight controls-itemActionsV_padding-bottom_default '
            );
        });
    });

    it('.getSearchValue()', () => {
        const item = new CollectionItem({ searchValue: 'abc' });
        expect(item.getSearchValue()).toEqual('abc');

        item.setSearchValue('123');
        expect(item.getSearchValue()).toEqual('123');
    });

    it('shadowVisibility', () => {
        let item = new CollectionItem({
            hasMoreDataUp: false,
            isFirstStickedItem: false,
        });
        expect(item.getShadowVisibility()).toEqual('visible');

        item = new CollectionItem({
            hasMoreDataUp: true,
            isFirstStickedItem: false,
        });
        expect(item.getShadowVisibility()).toEqual('visible');

        item = new CollectionItem({
            hasMoreDataUp: false,
            isFirstStickedItem: true,
        });
        expect(item.getShadowVisibility()).toEqual('visible');

        item = new CollectionItem({
            hasMoreDataUp: true,
            isFirstStickedItem: true,
        });
        expect(item.getShadowVisibility()).toEqual('initial');
    });
});
