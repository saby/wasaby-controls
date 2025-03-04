import { DEFAULT_SELECTORS, getSelectorsState } from 'Controls/_columnScrollReact/common/selectors';

describe('ControlsUnit/columnScrollReact/common/selectors', () => {
    it('DEFAULT_SELECTORS', () => {
        expect(DEFAULT_SELECTORS).toEqual({
            FIXED_ELEMENT: 'js-controls-ColumnScrollReact_fixed',
            SCROLLABLE_ELEMENT: 'js-controls-ColumnScrollReact_scrollable',
            OFFSET_FOR_END_FIXED_ELEMENT: 'js-controls-ColumnScrollReact_offsetForEndFixed',
            OFFSET_FOR_START_FIXED_ELEMENT: 'js-controls-ColumnScrollReact_offsetForStartFixed',
            FIXED_TO_RIGHT_EDGE_ELEMENT: 'js-controls-ColumnScrollReact_fixed-toRightEdge',
            HIDE_ALL_FIXED_ELEMENTS: 'js-controls-ColumnScrollReact_hideFixedElements',
            NOT_DRAG_SCROLLABLE: 'js-controls-ColumnScrollReact_notDragScrollable',
            ROOT_TRANSFORMED_ELEMENT: 'js-controls-ColumnScrollReact_root-scroll-transform',
            STRETCHED_TO_VIEWPORT_ELEMENT:
                'js-controls-ColumnScrollReact_stretchedToViewPortElement',
            AUTOSCROLL_TARGET: 'js-controls-ColumnScrollReact_autoScrollTarget',
        });
    });

    describe('getSelectorsState.', () => {
        it('default', () => {
            expect(getSelectorsState()).toEqual({
                FIXED_ELEMENT: 'js-controls-ColumnScrollReact_fixed',
                SCROLLABLE_ELEMENT: 'js-controls-ColumnScrollReact_scrollable',
                OFFSET_FOR_END_FIXED_ELEMENT: 'js-controls-ColumnScrollReact_offsetForEndFixed',
                OFFSET_FOR_START_FIXED_ELEMENT: 'js-controls-ColumnScrollReact_offsetForStartFixed',
                FIXED_TO_RIGHT_EDGE_ELEMENT: 'js-controls-ColumnScrollReact_fixed-toRightEdge',
                HIDE_ALL_FIXED_ELEMENTS: 'js-controls-ColumnScrollReact_hideFixedElements',
                NOT_DRAG_SCROLLABLE: 'js-controls-ColumnScrollReact_notDragScrollable',
                ROOT_TRANSFORMED_ELEMENT: 'js-controls-ColumnScrollReact_root-scroll-transform',
                STRETCHED_TO_VIEWPORT_ELEMENT:
                    'js-controls-ColumnScrollReact_stretchedToViewPortElement',
                AUTOSCROLL_TARGET: 'js-controls-ColumnScrollReact_autoScrollTarget',
            });
        });

        it('with any classes, without GUID.', () => {
            expect(
                getSelectorsState({
                    ROOT_TRANSFORMED_ELEMENT: 'js-testRootTransformed',
                })
            ).toEqual({
                FIXED_ELEMENT: 'js-controls-ColumnScrollReact_fixed',
                SCROLLABLE_ELEMENT: 'js-controls-ColumnScrollReact_scrollable',
                OFFSET_FOR_END_FIXED_ELEMENT: 'js-controls-ColumnScrollReact_offsetForEndFixed',
                OFFSET_FOR_START_FIXED_ELEMENT: 'js-controls-ColumnScrollReact_offsetForStartFixed',
                FIXED_TO_RIGHT_EDGE_ELEMENT: 'js-controls-ColumnScrollReact_fixed-toRightEdge',
                HIDE_ALL_FIXED_ELEMENTS: 'js-controls-ColumnScrollReact_hideFixedElements',
                NOT_DRAG_SCROLLABLE: 'js-controls-ColumnScrollReact_notDragScrollable',
                ROOT_TRANSFORMED_ELEMENT: 'js-testRootTransformed',
                STRETCHED_TO_VIEWPORT_ELEMENT:
                    'js-controls-ColumnScrollReact_stretchedToViewPortElement',
                AUTOSCROLL_TARGET: 'js-controls-ColumnScrollReact_autoScrollTarget',
            });
        });

        it('with any classes and custom selectors, without GUID.', () => {
            expect(
                getSelectorsState({
                    ROOT_TRANSFORMED_ELEMENT: 'js-testRootTransformed',

                    MY_OWN_SELECTOR_1: 'js-MY_OWN_SELECTOR_1',
                    MY_OWN_SELECTOR_2: 'js-MY_OWN_SELECTOR_2',
                })
            ).toEqual({
                FIXED_ELEMENT: 'js-controls-ColumnScrollReact_fixed',
                SCROLLABLE_ELEMENT: 'js-controls-ColumnScrollReact_scrollable',
                OFFSET_FOR_END_FIXED_ELEMENT: 'js-controls-ColumnScrollReact_offsetForEndFixed',
                OFFSET_FOR_START_FIXED_ELEMENT: 'js-controls-ColumnScrollReact_offsetForStartFixed',
                FIXED_TO_RIGHT_EDGE_ELEMENT: 'js-controls-ColumnScrollReact_fixed-toRightEdge',
                HIDE_ALL_FIXED_ELEMENTS: 'js-controls-ColumnScrollReact_hideFixedElements',
                NOT_DRAG_SCROLLABLE: 'js-controls-ColumnScrollReact_notDragScrollable',
                ROOT_TRANSFORMED_ELEMENT: 'js-testRootTransformed',
                STRETCHED_TO_VIEWPORT_ELEMENT:
                    'js-controls-ColumnScrollReact_stretchedToViewPortElement',
                AUTOSCROLL_TARGET: 'js-controls-ColumnScrollReact_autoScrollTarget',

                MY_OWN_SELECTOR_1: 'js-MY_OWN_SELECTOR_1',
                MY_OWN_SELECTOR_2: 'js-MY_OWN_SELECTOR_2',
            });
        });

        it('with all classes, without GUID.', () => {
            expect(
                getSelectorsState({
                    FIXED_ELEMENT: 'anyFixed',
                    SCROLLABLE_ELEMENT: 'anyScrollable',
                    NOT_DRAG_SCROLLABLE: 'js-TestNot-drag-scrollable',
                    ROOT_TRANSFORMED_ELEMENT: 'js-testRootTransformed',
                })
            ).toEqual({
                FIXED_ELEMENT: 'anyFixed',
                SCROLLABLE_ELEMENT: 'anyScrollable',
                OFFSET_FOR_END_FIXED_ELEMENT: 'js-controls-ColumnScrollReact_offsetForEndFixed',
                OFFSET_FOR_START_FIXED_ELEMENT: 'js-controls-ColumnScrollReact_offsetForStartFixed',
                FIXED_TO_RIGHT_EDGE_ELEMENT: 'js-controls-ColumnScrollReact_fixed-toRightEdge',
                HIDE_ALL_FIXED_ELEMENTS: 'js-controls-ColumnScrollReact_hideFixedElements',
                NOT_DRAG_SCROLLABLE: 'js-TestNot-drag-scrollable',
                ROOT_TRANSFORMED_ELEMENT: 'js-testRootTransformed',
                STRETCHED_TO_VIEWPORT_ELEMENT:
                    'js-controls-ColumnScrollReact_stretchedToViewPortElement',
                AUTOSCROLL_TARGET: 'js-controls-ColumnScrollReact_autoScrollTarget',
            });
        });

        it('with all classes and custom selectors, without GUID.', () => {
            expect(
                getSelectorsState({
                    FIXED_ELEMENT: 'anyFixed',
                    SCROLLABLE_ELEMENT: 'js-scrollable',
                    NOT_DRAG_SCROLLABLE: 'js-TestNot-drag-scrollable',
                    ROOT_TRANSFORMED_ELEMENT: 'js-testRootTransformed',

                    MY_OWN_SELECTOR_1: 'js-MY_OWN_SELECTOR_1',
                    MY_OWN_SELECTOR_2: 'js-MY_OWN_SELECTOR_2',
                })
            ).toEqual({
                FIXED_ELEMENT: 'anyFixed',
                SCROLLABLE_ELEMENT: 'js-scrollable',
                OFFSET_FOR_END_FIXED_ELEMENT: 'js-controls-ColumnScrollReact_offsetForEndFixed',
                OFFSET_FOR_START_FIXED_ELEMENT: 'js-controls-ColumnScrollReact_offsetForStartFixed',
                FIXED_TO_RIGHT_EDGE_ELEMENT: 'js-controls-ColumnScrollReact_fixed-toRightEdge',
                HIDE_ALL_FIXED_ELEMENTS: 'js-controls-ColumnScrollReact_hideFixedElements',
                NOT_DRAG_SCROLLABLE: 'js-TestNot-drag-scrollable',
                ROOT_TRANSFORMED_ELEMENT: 'js-testRootTransformed',
                STRETCHED_TO_VIEWPORT_ELEMENT:
                    'js-controls-ColumnScrollReact_stretchedToViewPortElement',
                AUTOSCROLL_TARGET: 'js-controls-ColumnScrollReact_autoScrollTarget',

                MY_OWN_SELECTOR_1: 'js-MY_OWN_SELECTOR_1',
                MY_OWN_SELECTOR_2: 'js-MY_OWN_SELECTOR_2',
            });
        });

        it('with any classes, with GUID.', () => {
            expect(
                getSelectorsState(
                    {
                        ROOT_TRANSFORMED_ELEMENT: 'js-testRootTransformed',
                    },
                    '1212-134432-2311214'
                )
            ).toEqual({
                FIXED_ELEMENT: 'js-controls-ColumnScrollReact_fixed_1212-134432-2311214',
                SCROLLABLE_ELEMENT: 'js-controls-ColumnScrollReact_scrollable_1212-134432-2311214',
                OFFSET_FOR_END_FIXED_ELEMENT:
                    'js-controls-ColumnScrollReact_offsetForEndFixed_1212-134432-2311214',
                OFFSET_FOR_START_FIXED_ELEMENT:
                    'js-controls-ColumnScrollReact_offsetForStartFixed_1212-134432-2311214',
                FIXED_TO_RIGHT_EDGE_ELEMENT:
                    'js-controls-ColumnScrollReact_fixed-toRightEdge_1212-134432-2311214',
                HIDE_ALL_FIXED_ELEMENTS:
                    'js-controls-ColumnScrollReact_hideFixedElements_1212-134432-2311214',
                NOT_DRAG_SCROLLABLE:
                    'js-controls-ColumnScrollReact_notDragScrollable_1212-134432-2311214',
                ROOT_TRANSFORMED_ELEMENT: 'js-testRootTransformed_1212-134432-2311214',
                STRETCHED_TO_VIEWPORT_ELEMENT:
                    'js-controls-ColumnScrollReact_stretchedToViewPortElement_1212-134432-2311214',
                AUTOSCROLL_TARGET:
                    'js-controls-ColumnScrollReact_autoScrollTarget_1212-134432-2311214',
            });
        });

        it('with any classes and custom selectors, with GUID.', () => {
            expect(
                getSelectorsState(
                    {
                        ROOT_TRANSFORMED_ELEMENT: 'js-testRootTransformed',

                        MY_OWN_SELECTOR_1: 'js-MY_OWN_SELECTOR_1',
                        MY_OWN_SELECTOR_2: 'js-MY_OWN_SELECTOR_2',
                    },
                    '1212-134432-2311214'
                )
            ).toEqual({
                FIXED_ELEMENT: 'js-controls-ColumnScrollReact_fixed_1212-134432-2311214',
                SCROLLABLE_ELEMENT: 'js-controls-ColumnScrollReact_scrollable_1212-134432-2311214',
                OFFSET_FOR_END_FIXED_ELEMENT:
                    'js-controls-ColumnScrollReact_offsetForEndFixed_1212-134432-2311214',
                OFFSET_FOR_START_FIXED_ELEMENT:
                    'js-controls-ColumnScrollReact_offsetForStartFixed_1212-134432-2311214',
                FIXED_TO_RIGHT_EDGE_ELEMENT:
                    'js-controls-ColumnScrollReact_fixed-toRightEdge_1212-134432-2311214',
                HIDE_ALL_FIXED_ELEMENTS:
                    'js-controls-ColumnScrollReact_hideFixedElements_1212-134432-2311214',
                NOT_DRAG_SCROLLABLE:
                    'js-controls-ColumnScrollReact_notDragScrollable_1212-134432-2311214',
                ROOT_TRANSFORMED_ELEMENT: 'js-testRootTransformed_1212-134432-2311214',
                STRETCHED_TO_VIEWPORT_ELEMENT:
                    'js-controls-ColumnScrollReact_stretchedToViewPortElement_1212-134432-2311214',

                AUTOSCROLL_TARGET:
                    'js-controls-ColumnScrollReact_autoScrollTarget_1212-134432-2311214',

                MY_OWN_SELECTOR_1: 'js-MY_OWN_SELECTOR_1',
                MY_OWN_SELECTOR_2: 'js-MY_OWN_SELECTOR_2',

                MY_OWN_SELECTOR_1_uniq: 'js-MY_OWN_SELECTOR_1_1212-134432-2311214',
                MY_OWN_SELECTOR_2_uniq: 'js-MY_OWN_SELECTOR_2_1212-134432-2311214',
            });
        });

        it('with all classes, with GUID.', () => {
            expect(
                getSelectorsState(
                    {
                        FIXED_ELEMENT: 'anyFixed',
                        SCROLLABLE_ELEMENT: 'anyScrollable',
                        NOT_DRAG_SCROLLABLE: 'js-TestNot-drag-scrollable',
                        ROOT_TRANSFORMED_ELEMENT: 'js-testRootTransformed',
                    },
                    '661-1-1-611-61-155-7'
                )
            ).toEqual({
                FIXED_ELEMENT: 'anyFixed_661-1-1-611-61-155-7',
                SCROLLABLE_ELEMENT: 'anyScrollable_661-1-1-611-61-155-7',
                OFFSET_FOR_END_FIXED_ELEMENT:
                    'js-controls-ColumnScrollReact_offsetForEndFixed_661-1-1-611-61-155-7',
                OFFSET_FOR_START_FIXED_ELEMENT:
                    'js-controls-ColumnScrollReact_offsetForStartFixed_661-1-1-611-61-155-7',
                FIXED_TO_RIGHT_EDGE_ELEMENT:
                    'js-controls-ColumnScrollReact_fixed-toRightEdge_661-1-1-611-61-155-7',
                HIDE_ALL_FIXED_ELEMENTS:
                    'js-controls-ColumnScrollReact_hideFixedElements_661-1-1-611-61-155-7',
                NOT_DRAG_SCROLLABLE: 'js-TestNot-drag-scrollable_661-1-1-611-61-155-7',
                ROOT_TRANSFORMED_ELEMENT: 'js-testRootTransformed_661-1-1-611-61-155-7',
                STRETCHED_TO_VIEWPORT_ELEMENT:
                    'js-controls-ColumnScrollReact_stretchedToViewPortElement_661-1-1-611-61-155-7',
                AUTOSCROLL_TARGET:
                    'js-controls-ColumnScrollReact_autoScrollTarget_661-1-1-611-61-155-7',
            });
        });

        it('with all classes and custom selectors, with GUID.', () => {
            expect(
                getSelectorsState(
                    {
                        FIXED_ELEMENT: 'anyFixed',
                        NOT_DRAG_SCROLLABLE: 'js-TestNot-drag-scrollable',
                        ROOT_TRANSFORMED_ELEMENT: 'js-testRootTransformed',
                        SCROLLABLE_ELEMENT: 'js-Test-scrollable',

                        MY_OWN_SELECTOR_1: 'js-MY_OWN_SELECTOR_1',
                        MY_OWN_SELECTOR_2: 'js-MY_OWN_SELECTOR_2',
                    },
                    '661-1-1-611-61-155-7'
                )
            ).toEqual({
                FIXED_ELEMENT: 'anyFixed_661-1-1-611-61-155-7',
                SCROLLABLE_ELEMENT: 'js-Test-scrollable_661-1-1-611-61-155-7',
                OFFSET_FOR_END_FIXED_ELEMENT:
                    'js-controls-ColumnScrollReact_offsetForEndFixed_661-1-1-611-61-155-7',
                OFFSET_FOR_START_FIXED_ELEMENT:
                    'js-controls-ColumnScrollReact_offsetForStartFixed_661-1-1-611-61-155-7',
                FIXED_TO_RIGHT_EDGE_ELEMENT:
                    'js-controls-ColumnScrollReact_fixed-toRightEdge_661-1-1-611-61-155-7',
                HIDE_ALL_FIXED_ELEMENTS:
                    'js-controls-ColumnScrollReact_hideFixedElements_661-1-1-611-61-155-7',
                NOT_DRAG_SCROLLABLE: 'js-TestNot-drag-scrollable_661-1-1-611-61-155-7',
                ROOT_TRANSFORMED_ELEMENT: 'js-testRootTransformed_661-1-1-611-61-155-7',
                STRETCHED_TO_VIEWPORT_ELEMENT:
                    'js-controls-ColumnScrollReact_stretchedToViewPortElement_661-1-1-611-61-155-7',
                AUTOSCROLL_TARGET:
                    'js-controls-ColumnScrollReact_autoScrollTarget_661-1-1-611-61-155-7',

                MY_OWN_SELECTOR_1: 'js-MY_OWN_SELECTOR_1',
                MY_OWN_SELECTOR_2: 'js-MY_OWN_SELECTOR_2',

                MY_OWN_SELECTOR_1_uniq: 'js-MY_OWN_SELECTOR_1_661-1-1-611-61-155-7',
                MY_OWN_SELECTOR_2_uniq: 'js-MY_OWN_SELECTOR_2_661-1-1-611-61-155-7',
            });
        });
    });
});
