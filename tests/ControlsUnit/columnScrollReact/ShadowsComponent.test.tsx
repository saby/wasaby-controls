/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { WasabyEvents } from 'UICore/Events';

import * as React from 'react';

import ShadowsComponentConsumer, {
    ShadowsComponent,
} from 'Controls/_columnScrollReact/ShadowsComponent';
import {
    ColumnScrollContext,
    IColumnScrollContext,
} from 'Controls/_columnScrollReact/context/ColumnScrollContext';
import { SELECTORS } from './SelectorsForTests';
import { EdgeState } from 'Controls/_columnScrollReact/common/types';
import { renderAnyComponent } from './forTestsOnly/helpers';
import { AnimationSteps } from './forTestsOnly/animationSteps';

function FakeContextProviderForShadows(props: {
    children: JSX.Element;
    leftEdgeState: IColumnScrollContext['leftEdgeState'];
    rightEdgeState: IColumnScrollContext['rightEdgeState'];
}): JSX.Element {
    const context = React.useMemo<Partial<IColumnScrollContext>>(() => {
        return {
            SELECTORS,
            leftEdgeState: props.leftEdgeState,
            rightEdgeState: props.rightEdgeState,
            isNeedByWidth: true,
        };
    }, []) as IColumnScrollContext;
    return (
        <ColumnScrollContext.Provider value={context}>
            {props.children}
        </ColumnScrollContext.Provider>
    );
}

describe('ControlsUnit/columnScrollReact/ShadowsComponent', () => {
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

    describe('Snapshots with different shadows visibility.', () => {
        test.each`
            isLeftVisible | isRightVisible
            ${true}       | ${true}
            ${true}       | ${false}
            ${false}      | ${true}
            ${false}      | ${false}
        `(
            'isLeftVisible=$isLeftVisible, isRightVisible=$isRightVisible',
            ({ isLeftVisible, isRightVisible }) => {
                const { asFragment } = renderAnyComponent(
                    <ShadowsComponent
                        isLeftVisible={isLeftVisible}
                        isRightVisible={isRightVisible}
                    />,
                    { container }
                );
                expect(asFragment()).toMatchSnapshot();
            }
        );
    });

    describe('Snapshots with different shadows user classes.', () => {
        test.each`
            leftShadowClassName   | rightShadowClassName
            ${null}               | ${null}
            ${undefined}          | ${undefined}
            ${' '}                | ${' '}
            ${'custom_className'} | ${undefined}
            ${undefined}          | ${'custom_className'}
            ${'custom_className'} | ${'custom_className'}
        `(
            'leftShadowClassName=$leftShadowClassName, rightShadowClassName=$rightShadowClassName',
            ({ leftShadowClassName, rightShadowClassName }) => {
                const { asFragment } = renderAnyComponent(
                    <ShadowsComponent
                        leftShadowClassName={leftShadowClassName}
                        rightShadowClassName={rightShadowClassName}
                        isLeftVisible={false}
                        isRightVisible={false}
                    />,
                    { container }
                );
                expect(asFragment()).toMatchSnapshot();
            }
        );
    });

    describe('with context and consumer.', () => {
        describe('shadows for different edges state(only valid edges state variants).', () => {
            const testCases = [
                [EdgeState.Visible, EdgeState.Invisible],
                [EdgeState.Invisible, EdgeState.Invisible],
                [EdgeState.Invisible, EdgeState.Visible],
            ].concat(
                AnimationSteps.map((step) => {
                    return [step.leftEdgeState, step.rightEdgeState];
                })
            );

            testCases.forEach(([leftEdgeState, rightEdgeState]) => {
                it(`leftEdgeState=${leftEdgeState}, rightEdgeState=${rightEdgeState}`, () => {
                    const { asFragment } = renderAnyComponent(
                        <FakeContextProviderForShadows
                            leftEdgeState={leftEdgeState}
                            rightEdgeState={rightEdgeState}
                        >
                            <ShadowsComponentConsumer />
                        </FakeContextProviderForShadows>,
                        { container }
                    );
                    expect(asFragment()).toMatchSnapshot();
                });
            });
        });
    });
});
