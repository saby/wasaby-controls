/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { WasabyEvents } from 'UICore/Events';
import { fireEvent, render, waitFor } from '@testing-library/react';
import StickyBlockDouble from 'Controls/StickyBlockDouble';
import { Container } from 'Controls/scroll';

function getContent(control) {
    return (
        <Container>
            <div>
                {control}
                <p>lorem</p>
            </div>
        </Container>
    );
}

function getScrollContainer(container) {
    return container.querySelector('.controls-Scroll-ContainerBase');
}

describe('Controls/stickyBlockDouble', () => {
    let container: HTMLElement;

    beforeEach(() => {
        jest.useFakeTimers('modern');
        jest.setSystemTime(new Date(1996, 5, 21));
        container = document.createElement('div');
        WasabyEvents.initInstance(container);
        document.body.appendChild(container);
    });

    afterEach(() => {
        unmountComponentAtNode(container);
        WasabyEvents.destroyInstance(container);
        jest.useRealTimers();
        container.remove();
        container = undefined;
    });

    it('renders with props', () => {
        const props = {
            compactContentTemplate: <div>Compact Content</div>,
            contentTemplate: <div>Normal Content</div>,
        };
        render(getContent(<StickyBlockDouble {...props} />), { container });
        expect(container).toMatchSnapshot();
    });

    it('renders with no compactContentTemplate', () => {
        const props = {
            contentTemplate: <div>Normal Content</div>,
        };
        render(getContent(<StickyBlockDouble {...props} />), { container });
        expect(container).toMatchSnapshot();
    });

    it('renders with mode', () => {
        const props = {
            compactContentTemplate: <div>Compact Content</div>,
            contentTemplate: <div>Normal Content</div>,
            mode: 'stackable',
        };
        render(getContent(<StickyBlockDouble {...props} />), { container });
        expect(container).toMatchSnapshot();
    });

    it('renders with shadowMode', () => {
        const props = {
            compactContentTemplate: <div>Compact Content</div>,
            contentTemplate: <div>Normal Content</div>,
            shadowMode: 'rounded',
        };
        render(getContent(<StickyBlockDouble {...props} />), { container });
        expect(container).toMatchSnapshot();
    });

    it('renders for scrolling', async () => {
        const props = {
            compactContentTemplate: (
                <div className="compact-content" style={{ height: 20 }}>
                    Compact Content
                </div>
            ),
            contentTemplate: (
                <div className="normal-content" style={{ height: 100 }}>
                    Normal Content
                </div>
            ),
        };
        render(getContent(<StickyBlockDouble {...props} />), { container });

        const scrollContainer = getScrollContainer(container);
        jest.spyOn(scrollContainer, 'clientHeight', 'get').mockImplementation(() => 400);
        jest.spyOn(scrollContainer, 'scrollHeight', 'get').mockImplementation(() => 2000);

        const eventData = {
            target: {
                scrollTop: 100,
            },
        };
        fireEvent.scroll(scrollContainer, eventData);

        await waitFor(() => {
            expect(container).toMatchSnapshot();
        });
    });
});
