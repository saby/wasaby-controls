import { getEditorViewRenderClassName } from 'Controls/display';
import { CssClassesAssert } from 'ControlsUnit/CustomAsserts';

describe('getEditorViewRenderClassName', () => {
    it('base classes', () => {
        CssClassesAssert.include(getEditorViewRenderClassName(), [
            'controls-EditingTemplateText',
            'controls-EditingTemplateText_border-partial',
        ]);
    });

    describe('padding class for different modes', () => {
        it('no editing config', () => {
            CssClassesAssert.include(
                getEditorViewRenderClassName(),
                'controls-EditingTemplateText_withPadding'
            );
        });

        it('no editing config, but need padding', () => {
            CssClassesAssert.include(
                getEditorViewRenderClassName({ withPadding: true }),
                'controls-EditingTemplateText_withPadding'
            );
        });

        it('default editing mode', () => {
            CssClassesAssert.include(
                getEditorViewRenderClassName({ editingMode: undefined }),
                'controls-EditingTemplateText_withPadding'
            );
        });

        it('row editing mode', () => {
            CssClassesAssert.include(
                getEditorViewRenderClassName({ editingMode: 'row' }),
                'controls-EditingTemplateText_withPadding'
            );
        });

        it('cell editing mode', () => {
            CssClassesAssert.notInclude(
                getEditorViewRenderClassName({ editingMode: 'cell' }),
                'controls-EditingTemplateText_withPadding'
            );
        });
    });

    describe('hover classes for input', () => {
        const CLASS_NAMES = {
            VISIBLE:
                'controls-EditingTemplateText_InputBackgroundVisibility_visible',
            HIDDEN: 'controls-EditingTemplateText_InputBackgroundVisibility_hidden',
            ONHOVER:
                'controls-EditingTemplateText_InputBackgroundVisibility_onhover',
        };

        [
            {
                name: 'call method without params',
                methodParams: undefined,
                include: [],
                notInclude: [
                    CLASS_NAMES.VISIBLE,
                    CLASS_NAMES.ONHOVER,
                    CLASS_NAMES.HIDDEN,
                ],
            },
            {
                name: 'call method with empty object as params',
                methodParams: {},
                include: [],
                notInclude: [
                    CLASS_NAMES.VISIBLE,
                    CLASS_NAMES.ONHOVER,
                    CLASS_NAMES.HIDDEN,
                ],
            },
            {
                name: 'call method with {inputBackgroundVisibility: "visible"} as params',
                methodParams: { inputBackgroundVisibility: 'visible' },
                include: CLASS_NAMES.VISIBLE,
                notInclude: [CLASS_NAMES.ONHOVER, CLASS_NAMES.HIDDEN],
            },
            {
                name: 'call method with {inputBackgroundVisibility: "onhover"} as params',
                methodParams: { inputBackgroundVisibility: 'onhover' },
                include: CLASS_NAMES.ONHOVER,
                notInclude: [CLASS_NAMES.VISIBLE, CLASS_NAMES.HIDDEN],
            },
            {
                name: 'call method with {inputBackgroundVisibility: "hidden"} as params',
                methodParams: { inputBackgroundVisibility: 'hidden' },
                include: [],
                notInclude: [
                    CLASS_NAMES.ONHOVER,
                    CLASS_NAMES.VISIBLE,
                    CLASS_NAMES.HIDDEN,
                ],
            },
        ].forEach((testCase) => {
            it(testCase.name, () => {
                const classes = getEditorViewRenderClassName(
                    testCase.methodParams
                );
                CssClassesAssert.include(classes, testCase.include);
                CssClassesAssert.notInclude(classes, testCase.notInclude);
            });
        });
    });
});
