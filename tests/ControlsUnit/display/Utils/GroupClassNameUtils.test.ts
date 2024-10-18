import { GroupClassNameUtils } from 'Controls/display';
import { CssClassesAssert } from '../../CustomAsserts';

describe('ControlsUnit/display/GroupClassNameUtils', () => {
    describe('getTextClassName', () => {
        it('should contain align class', () => {
            let classes: string;
            classes = GroupClassNameUtils.getTextClassName(
                'left',
                undefined,
                undefined,
                undefined,
                undefined,
                undefined
            );
            CssClassesAssert.include(classes, ['controls-ListView__groupContent_left']);

            classes = GroupClassNameUtils.getTextClassName(
                'right',
                undefined,
                undefined,
                undefined,
                undefined,
                undefined
            );
            CssClassesAssert.include(classes, ['controls-ListView__groupContent_right']);

            classes = GroupClassNameUtils.getTextClassName(
                'center',
                undefined,
                undefined,
                undefined,
                undefined,
                undefined
            );
            CssClassesAssert.include(classes, ['controls-ListView__groupContent_center']);
        });
    });

    describe('getTextWrapperClassName', () => {
        it('should contain styling classes when styling options are set', () => {
            const classes = GroupClassNameUtils.getTextWrapperClassName(
                'secondary',
                's',
                'bold',
                'uppercase'
            );
            CssClassesAssert.include(classes, [
                'controls-fontsize-s',
                'controls-text-secondary',
                'controls-fontweight-bold',
                'controls-ListView__groupContent_textTransform_uppercase',
                'controls-ListView__groupContent_textTransform_uppercase_s',
            ]);
        });

        it('should contain default styling class when styling options are not set', () => {
            const classes = GroupClassNameUtils.getTextWrapperClassName();
            CssClassesAssert.include(classes, [
                'controls-ListView__groupContent-text_default',
                'controls-ListView__groupContent-text_color_default',
            ]);
            CssClassesAssert.notInclude(classes, [
                'controls-fontweight-bold',
                'controls-ListView__groupContent_textTransform_uppercase',
                'controls-ListView__groupContent_textTransform_uppercase_s',
            ]);
        });

        it('should NOT contain placeholder class when contain separator', () => {
            const classes = GroupClassNameUtils.getTextWrapperClassName(
                undefined,
                undefined,
                undefined,
                undefined,
                true
            );
            CssClassesAssert.notInclude(classes, ['tw-flex-grow']);
        });

        it('should contain placeholder class when no separator', () => {
            const classes = GroupClassNameUtils.getTextWrapperClassName(
                undefined,
                undefined,
                undefined,
                undefined,
                false
            );
            CssClassesAssert.include(classes, ['tw-flex-grow']);
        });
    });
});
