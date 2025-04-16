/**
 * @jest-environment jsdom
 */
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import RoundChart from 'Controls-Graphs/RoundChart';
import { TEST_DATA, TEST_SERIES } from './TestData';

describe('Controls-Graphs/RoundChart', function () {
    let container: Element | null = null;
    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });
    afterEach(() => {
        unmountComponentAtNode(container as Element);
        (container as Element).remove();
        container = null;
    });
    it('Минимальная конфигурация', function () {
        act(() => {
            render(<RoundChart data={TEST_DATA} series={TEST_SERIES} />, container);
        });
        expect(container).toMatchSnapshot();
    });
    it('legendVisible=true, legendVerticalPosition=top', function () {
        act(() => {
            render(
                <RoundChart data={TEST_DATA} series={TEST_SERIES} legendVisible={true} />,
                container
            );
        });
        expect(container).toMatchSnapshot();
    });
    it('legendVisible=true, legendVerticalPosition=bottom', function () {
        act(() => {
            render(
                <RoundChart
                    data={TEST_DATA}
                    series={TEST_SERIES}
                    legendVisible={true}
                    legendVerticalPosition="bottom"
                />,
                container
            );
        });
        expect(container).toMatchSnapshot();
    });
});
