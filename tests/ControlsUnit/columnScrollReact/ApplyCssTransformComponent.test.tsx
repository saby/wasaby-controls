/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { WasabyEvents } from 'UICore/Events';

import { ApplyCssTransformComponent } from 'Controls/_columnScrollReact/ApplyCssTransformComponent';
import { EdgeState } from 'Controls/_columnScrollReact/common/types';

import { SELECTORS } from './SelectorsForTests';
import { renderStyleCompositeComponent } from './forTestsOnly/helpers';
import { AnimationSteps } from './forTestsOnly/animationSteps';

describe('ControlsUnit/columnScrollReact/ApplyCssTransformComponent', () => {
    let container = null;

    beforeEach(() => {
        container = document.createElement('div');
        WasabyEvents.initInstance(container);
        document.body.appendChild(container);
    });

    afterEach(() => {
        unmountComponentAtNode(container);
        WasabyEvents.destroyInstance(container);
        container.remove();
        container = null;
    });

    describe('mobile device.', () => {
        it('render only static and width dependent components.', () => {
            const { asFragment } = renderStyleCompositeComponent(
                <ApplyCssTransformComponent
                    selectors={SELECTORS}
                    isMobile={true}
                    fixedWidth={230}
                />,
                { container }
            );
            expect(asFragment()).toMatchSnapshot();
        });
    });

    describe('desktop device.', () => {
        describe('no animation.', () => {
            it('render static, width and position styles components.', () => {
                const { asFragment } = renderStyleCompositeComponent(
                    <ApplyCssTransformComponent
                        selectors={SELECTORS}
                        isMobile={false}
                        position={150}
                        fixedWidth={230}
                        previousPosition={130}
                        leftEdgeState={EdgeState.Invisible}
                        rightEdgeState={EdgeState.Invisible}
                        onAnimationEnd={() => {
                            return void 0;
                        }}
                    />,
                    { container }
                );
                expect(asFragment()).toMatchSnapshot();
            });
        });

        describe('animation.', () => {
            describe('static tests.', () => {
                AnimationSteps.forEach((params, index) => {
                    it(`${index}. ${params.from} -> ${params.to}. Edges: [${params.leftEdgeState}, ${params.rightEdgeState}]`, () => {
                        const { asFragment } = renderStyleCompositeComponent(
                            <ApplyCssTransformComponent
                                selectors={SELECTORS}
                                fixedWidth={230}
                                isMobile={false}
                                previousPosition={params.from}
                                position={params.to}
                                leftEdgeState={params.leftEdgeState}
                                rightEdgeState={params.rightEdgeState}
                                onAnimationEnd={jest.fn()}
                            />,
                            { container }
                        );
                        expect(asFragment()).toMatchSnapshot();
                    });
                });
            });
        });
    });
});
