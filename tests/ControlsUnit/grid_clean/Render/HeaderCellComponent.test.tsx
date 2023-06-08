/**
 * @jest-environment jsdom
 */
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { GridHeaderCell, HeaderContent } from 'Controls/grid';
import { getHeaderRowMock } from 'ControlsUnit/_listsUtils/mockOwner';

const columns = [{}, {}];

const column = new GridHeaderCell({
    column: columns[0],
    owner: getHeaderRowMock({
        gridColumnsConfig: columns,
        headerColumnsConfig: columns,
        hasMultiSelectColumn: true,
        isMultiline: false,
    }),
    isCheckBoxCell: false,
});

describe('ControlsUnit/grid_clean/Render/HeaderCellComponent', () => {
    let container = null;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        unmountComponentAtNode(container);
        container.remove();
        container = null;
    });

    it('HeaderContent render title, className, data-qa from attrs', () => {
        act(() => {
            render(
                <HeaderContent
                    column={column}
                    attrs={{
                        className: 'custom-classname',
                        title: 'custom-title',
                        'data-qa': 'custom-qa-selector',
                    }}
                />,
                container
            );
        });

        expect(container.firstChild.getAttribute('data-qa')).toBe(
            'custom-qa-selector'
        );
        expect(container.firstChild.getAttribute('title')).toBe('custom-title');
        expect(container.firstChild.className).toContain('custom-classname');
    });

    it('HeaderContent render title, className, data-qa from props', () => {
        act(() => {
            render(
                <HeaderContent
                    column={column}
                    className={'custom-classname'}
                    tooltip={'custom-title'}
                    data-qa={'custom-qa-selector'}
                />,
                container
            );
        });

        expect(container.firstChild.getAttribute('data-qa')).toBe(
            'custom-qa-selector'
        );
        expect(container.firstChild.getAttribute('title')).toBe('custom-title');
        expect(container.firstChild.className).toContain('custom-classname');
    });
});
