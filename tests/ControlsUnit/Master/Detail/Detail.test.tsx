/**
 * @jest-environment jsdom
 */
import * as React from 'react';
import { Base as MasterDetail } from 'Controls/masterDetail';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { WasabyEvents } from 'UICore/Events';

const faceContentTemplate = React.forwardRef<{}, HTMLDivElement>((_, ref) => <div ref={ref}></div>);

type MasterDetailPropsPart = Partial<React.ComponentProps<typeof MasterDetail>>;

const masterDetailDefaultProps: React.ComponentProps<typeof MasterDetail> = {
    master: faceContentTemplate,
    detail: faceContentTemplate,
};

describe('Controls/masterDetail:Base', () => {
    let container = null;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        WasabyEvents.initInstance(container);
    });

    afterEach(() => {
        unmountComponentAtNode(container);
        WasabyEvents.destroyInstance(container);
        container.remove();
        container = null;
    });

    it('MasterDetail рендер с установкой макс/мин ширины (base)', () => {
        // base
        const props: MasterDetailPropsPart = {
            masterMinWidth: 100,
            masterWidth: 200,
            masterMaxWidth: 299,
        };

        act(() => {
            render(<MasterDetail {...masterDetailDefaultProps} {...props} />, container);
        });

        expect(container).toMatchSnapshot();
    });

    it('MasterDetail рендер с установкой макс/мин ширины (wrong maxWidth)', () => {
        // wrong maxWidth
        const props: MasterDetailPropsPart = {
            masterMinWidth: 100,
            masterWidth: 200,
            masterMaxWidth: 150,
        };

        act(() => {
            render(<MasterDetail {...masterDetailDefaultProps} {...props} />, container);
        });

        expect(container).toMatchSnapshot();
    });

    it('MasterDetail рендер с установкой макс/мин ширины (wrong minWidth)', () => {
        // wrong minWidth
        const props: MasterDetailPropsPart = {
            masterMinWidth: 250,
            masterWidth: 200,
            masterMaxWidth: 299,
        };

        act(() => {
            render(<MasterDetail {...masterDetailDefaultProps} {...props} />, container);
        });

        expect(container).toMatchSnapshot();
    });

    it('MasterDetail рендер с установкой masterVisibility', () => {
        const props: MasterDetailPropsPart = {
            masterVisibility: 'hidden',
        };

        act(() => {
            render(<MasterDetail {...masterDetailDefaultProps} {...props} />, container);
        });

        expect(container).toMatchSnapshot();
    });

    it('MasterDetail рендер с установкой masterPosition', () => {
        const props1: MasterDetailPropsPart = {
            masterPosition: 'right',
        };
        const props2: MasterDetailPropsPart = {
            masterPosition: 'right',
        };

        act(() => {
            render(<MasterDetail {...masterDetailDefaultProps} {...props1} />, container);
        });
        expect(container).toMatchSnapshot();

        act(() => {
            render(<MasterDetail {...masterDetailDefaultProps} {...props2} />, container);
        });
        expect(container).toMatchSnapshot();
    });

    it('MasterDetail рендер с установкой ширины + propStorageId', () => {
        const props: MasterDetailPropsPart = {
            masterMinWidth: 100,
            masterWidth: 200,
            masterMaxWidth: 299,
            propStorageId: 'testId',
            initialMasterWidth: 200,
        };

        act(() => {
            render(<MasterDetail {...masterDetailDefaultProps} {...props} />, container);
        });

        expect(container).toMatchSnapshot();
    });
});
