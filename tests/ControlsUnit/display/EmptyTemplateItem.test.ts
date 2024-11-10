import { CssClassesAssert as cAssert } from 'ControlsUnit/CustomAsserts';
import EmptyTemplateItem from 'Controls/_display/EmptyTemplateItem';
import { getCollectionMock } from 'ControlsUnit/_listsUtils/mockOwner';

describe('Controls/display/EmptyTemplateItem', () => {
    const empty = new EmptyTemplateItem({
        owner: getCollectionMock(),
        template: () => {
            return '<div></div>';
        },
        templateOptions: {},
        multiSelectVisibility: 'hidden',
    });

    describe('getContentClasses()', () => {
        it('align=center. Should not add side offset', () => {
            const classes = empty.getContentClasses({});
            cAssert.notInclude(classes, [
                'controls-ListView__item-rightPadding_default',
                'controls-ListView__item-leftPadding_default',
            ]);
        });

        it('align=undefined. Should not add side offset', () => {
            const classes = empty.getContentClasses({ align: 'center' });
            cAssert.notInclude(classes, [
                'controls-ListView__item-rightPadding_default',
                'controls-ListView__item-leftPadding_default',
            ]);
        });

        it('align=right. Should add side offset', () => {
            const classes = empty.getContentClasses({ align: 'right' });
            cAssert.include(classes, [
                'controls-ListView__item-rightPadding_default',
                'controls-ListView__item-leftPadding_default',
            ]);
        });

        it('align=left. Should add side offset', () => {
            const classes = empty.getContentClasses({ align: 'left' });
            cAssert.include(classes, [
                'controls-ListView__item-rightPadding_default',
                'controls-ListView__item-leftPadding_default',
            ]);
        });
    });
});
