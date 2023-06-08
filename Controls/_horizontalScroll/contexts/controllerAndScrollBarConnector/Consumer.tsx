/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import { TemplateFunction } from 'UI/Base';
import * as React from 'react';
import { Context } from './Context';

interface IProps {
    content: TemplateFunction;
}

function Consumer(props: IProps): JSX.Element {
    const {
        scrollPositionChangedCallback,
        scrollBarReadyCallback,
        contentWidth,
        viewportWidth,
        fixedColumnsWidth,
    } = React.useContext(Context); // получаем из контекста данные
    return (
        <props.content
            {...props}
            scrollPositionChangedCallback={scrollPositionChangedCallback}
            scrollBarReadyCallback={scrollBarReadyCallback}
            contentWidth={contentWidth}
            viewportWidth={viewportWidth}
            fixedColumnsWidth={fixedColumnsWidth}
        />
    );
}
export default React.memo(Consumer);
