import { RecordSet } from 'Types/collection';
import TileCollection from 'Controls/_tile/display/TileCollection';
import TileView from 'Controls/_tile/TileView';
import { CssClassesAssert } from 'ControlsUnit/CustomAsserts';
import GroupItem from 'Controls/_display/GroupItem';
import { SyntheticEvent } from 'UI/Vdom';
import TileCollectionItem from 'Controls/_tile/display/TileCollectionItem';
/**
 * регистрация Controls/tile:TileCollectionItem находится именно в библиотеке,
 * и некоторые тесты этим пользуются
 */
import 'Controls/tile';

describe('Controls/_tile/TileView', () => {
    let tileView;
    let model;
    let cfg;
    beforeEach(() => {
        model = new TileCollection({
            tileMode: 'static',
            tileHeight: 300,
            imageProperty: 'image',
            tileScalingMode: 'outside',
            keyProperty: 'id',
            collection: new RecordSet({
                rawData: [
                    {
                        id: 1,
                        image: 'image1',
                    },
                    {
                        id: 2,
                        image: 'image2',
                    },
                ],
                keyProperty: 'id',
            }),
        });

        cfg = {
            listModel: model,
            keyProperty: 'id',
            tileScalingMode: 'outside',
            tileWidth: 200,
            theme: 'default',
        };

        tileView = new TileView(cfg);
        tileView.saveOptions(cfg);
        tileView._beforeMount(cfg);
    });

    describe('_onResize', () => {
        it('should reset hovered item', () => {
            const event = {
                type: '',
            };
            model.setHoveredItem(model.getItemBySourceKey(1));
            tileView._onResize(event);
            expect(model.getHoveredItem()).toEqual(null);
        });

        it('not should reset hovered item', () => {
            const event = {
                type: 'animationend',
            };
            model.setHoveredItem(model.getItemBySourceKey(1));
            tileView._onResize(event);
            expect(model.getHoveredItem().key).toEqual(1);
        });
    });

    describe('_onItemMouseMove', () => {
        it('not set item is hovered', () => {
            const event = {
                target: {
                    closest: () => {
                        return {
                            getBoundingClientRect: () => {
                                return {
                                    bottom: 473,
                                    height: 240,
                                    left: 360,
                                    right: 1560,
                                    top: 233,
                                    width: 1200,
                                    x: 360,
                                    y: 233,
                                };
                            },
                        };
                    },
                },
            };
            const item = model.getItemBySourceKey(1);
            tileView._onItemMouseMove(event, item);
            expect(item.isHovered()).toBe(false);
        });
    });

    describe('_getViewClasses', () => {
        it('default', () => {
            CssClassesAssert.include(
                tileView._getViewClasses(),
                'controls-TileView_new'
            );
            CssClassesAssert.include(
                tileView._getViewClasses(),
                'controls_list_theme-default'
            );
        });

        it('needShowEmptyTemplate option', () => {
            tileView.saveOptions({ ...cfg, needShowEmptyTemplate: true });
            CssClassesAssert.notInclude(
                tileView._getViewClasses(),
                'controls-TileView__itemPaddingContainer'
            );

            tileView.saveOptions({ ...cfg, needShowEmptyTemplate: false });
            CssClassesAssert.include(
                tileView._getViewClasses(),
                'controls-TileView__itemPaddingContainer'
            );
        });
    });

    describe('_getItemsPaddingContainerClasses', () => {
        it('_getItemsPaddingContainerClasses', () => {
            tileView.saveOptions({});
            const classes = tileView._getItemsPaddingContainerClasses();
            CssClassesAssert.include(
                classes,
                'controls-TileView__itemPaddingContainer'
            );
            CssClassesAssert.include(
                classes,
                'controls-TileView__itemsPaddingContainer_spacingLeft_default'
            );
            CssClassesAssert.include(
                classes,
                'controls-TileView__itemsPaddingContainer_spacingRight_default'
            );
            CssClassesAssert.include(
                classes,
                'controls-TileView__itemsPaddingContainer_spacingTop_default'
            );
            CssClassesAssert.include(
                classes,
                'controls-TileView__itemsPaddingContainer_spacingBottom_default'
            );
        });

        it('with itemPaddingsContainerOptions', () => {
            tileView.saveOptions({
                itemsContainerPadding: {
                    left: 's',
                    right: 'null',
                },
            });
            const classes = tileView._getItemsPaddingContainerClasses();
            CssClassesAssert.include(
                classes,
                'controls-TileView__itemPaddingContainer'
            );
            CssClassesAssert.include(
                classes,
                'controls-TileView__itemsPaddingContainer_spacingLeft_s_itemPadding_default'
            );
            CssClassesAssert.include(
                classes,
                'controls-TileView__itemsPaddingContainer_spacingRight_null_itemPadding_default'
            );
            CssClassesAssert.include(
                classes,
                'controls-TileView__itemsPaddingContainer_spacingTop_default_itemPadding_default'
            );
            CssClassesAssert.include(
                classes,
                'controls-TileView__itemsPaddingContainer_spacingBottom_default_itemPadding_default'
            );
        });
    });

    describe('_onItemMouseLeave', () => {
        let event;
        beforeEach(() => {
            event = new SyntheticEvent(null, {
                target: {
                    closest: () => {
                        return {};
                    },
                },
            });
        });
        it('not tile item', () => {
            const item = new GroupItem();
            expect(
                tileView._onItemMouseLeave.bind(tileView, event, item)
            ).not.toThrow();
        });

        it('tile item', () => {
            const owner = {
                getDisplayProperty: () => {
                    return '';
                },
                notifyItemChange: () => {
                    /* mock*/
                },
            };
            const item = new TileCollectionItem({ owner });
            const methodSpy = jest.spyOn(item, 'setCanShowActions').mockClear();
            tileView._onItemMouseLeave(event, item);
            expect(methodSpy).toHaveBeenCalledWith(false);
        });
    });

    describe('show actions', () => {
        it('delay with hover item', async () => {
            const mockedItemContainer = {
                getBoundingClientRect: () => {
                    return {};
                },
                querySelector: () => {
                    return {
                        getBoundingClientRect: () => {
                            return {};
                        },
                        classList: {
                            add: () => {
                                return null;
                            },
                            remove: () => {
                                return null;
                            },
                            contains: () => {
                                return null;
                            },
                        },
                        style: {},
                    };
                },
                closest: () => {
                    return undefined;
                },
            };

            model.setTileScalingMode('inside');
            model.getItemContainerPosition = () => {
                return {};
            };
            model.getItemContainerPositionInDocument = () => {
                return {};
            };
            model.getItemContainerStartPosition = () => {
                return {
                    left: 10,
                    right: 10,
                };
            };
            tileView.getItemsContainer = () => {
                return mockedItemContainer;
            };

            const event = new SyntheticEvent(null, {
                target: {
                    closest: (style) => {
                        if (style === '.js-controls-TileView__withoutZoom') {
                            return null;
                        }
                        if (
                            style ===
                            '.controls-TileView__item:not(.controls-TileView__item_unscalable)'
                        ) {
                            return mockedItemContainer;
                        }
                    },
                },
            });
            const item = model.at(0);
            tileView._onItemMouseEnter(event, item);
            tileView._onItemMouseMove(event, item);

            expect(tileView._mouseMoveTimeout).toBeTruthy();
            await tileView._mouseMoveTimeout;

            expect(item.canShowActions()).toBe(false);

            model.setHoveredItem(item);
            tileView._beforeUpdate(cfg);
            tileView._afterUpdate();

            expect(item.canShowActions()).toBe(true);
        });
        it('animation dont start with hovered item', async () => {
            const mockedItemContainer = {
                getBoundingClientRect: () => {
                    return {};
                },
                querySelector: () => {
                    return {
                        getBoundingClientRect: () => {
                            return {};
                        },
                        classList: {
                            add: () => {
                                return null;
                            },
                            remove: () => {
                                return null;
                            },
                        },
                        style: {},
                    };
                },
            };

            model.setTileScalingMode('inside');
            model.getItemContainerPosition = () => {
                return {};
            };
            model.getItemContainerPositionInDocument = () => {
                return {};
            };
            model.getItemContainerStartPosition = () => {
                return {
                    left: 10,
                    right: 10,
                };
            };
            tileView.getItemsContainer = () => {
                return mockedItemContainer;
            };

            const event = new SyntheticEvent(null, {
                target: {
                    closest: (style) => {
                        if (style === '.js-controls-TileView__withoutZoom') {
                            return null;
                        }
                        if (
                            style ===
                            '.controls-TileView__item:not(.controls-TileView__item_unscalable)'
                        ) {
                            return mockedItemContainer;
                        }
                    },
                },
            });
            const item = model.at(0);
            tileView._mouseMoveTimeout = null;
            model.setHoveredItem(item);
            tileView._onItemMouseEnter(event, item);
            expect(tileView._mouseMoveTimeout).toBeNull();
        });
    });
});
