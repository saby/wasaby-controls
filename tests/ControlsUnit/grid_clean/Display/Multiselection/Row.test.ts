import { Model } from 'Types/entity';
import { GridDataRow } from 'Controls/grid';
import { CssClassesAssert } from 'ControlsUnit/CustomAsserts';
import { getGridCollectionMock } from 'ControlsUnit/_listsUtils/mockOwner';

const rawData = { key: 1, col1: 'c1-1' };

describe('Controls/grid_clean/Display/Multiselection/Row', () => {
    describe('getMultiSelectClasses', () => {
        let row;

        beforeEach(() => {
            row = new GridDataRow({
                contents: new Model({
                    rawData,
                    keyProperty: 'key',
                }),
                owner: getGridCollectionMock({
                    hoverBackgroundStyle: 'default',
                    multiSelectVisibility: 'visible',
                }),
                columns: [{ displayProperty: 'col1' }],
            });
        });

        it('default', () => {
            const classes = row.getMultiSelectClasses();
            CssClassesAssert.include(classes, [
                'js-controls-ListView__notEditable',
                'controls-List_DragNDrop__notDraggable',
                'js-controls-DragScroll__notDraggable',
                'js-controls-ListView__checkbox',
                'controls-CheckboxMarker_inList',
                'controls-GridView__checkbox',
                'controls-GridView__checkbox_position-default',
            ]);
        });

        it('visibility onhover', () => {
            row.setMultiSelectVisibility('onhover');
            let classes = row.getMultiSelectClasses();
            CssClassesAssert.include(
                classes,
                'controls-ListView__checkbox-onhover'
            );

            row.setSelected(true);
            classes = row.getMultiSelectClasses();
            CssClassesAssert.notInclude(
                classes,
                'controls-ListView__checkbox-onhover'
            );

            row.setSelected(null);
            classes = row.getMultiSelectClasses();
            CssClassesAssert.notInclude(
                classes,
                'controls-ListView__checkbox-onhover'
            );
        });

        it('is dragged', () => {
            let classes = row.getMultiSelectClasses();
            CssClassesAssert.notInclude(
                classes,
                'controls-ListView__itemContent_faded'
            );

            row.setDragged(true);
            classes = row.getMultiSelectClasses();
            CssClassesAssert.include(
                classes,
                'controls-ListView__itemContent_faded'
            );
        });
    });
});
