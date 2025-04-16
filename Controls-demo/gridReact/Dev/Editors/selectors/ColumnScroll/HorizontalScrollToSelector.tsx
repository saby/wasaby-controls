import * as React from 'react';
import type { TScrollIntoViewAlign } from 'Controls/columnScrollReact';
import BaseSelector from '../../base/BaseSelector';
import { useTumbler } from '../../Tumbler';

interface IProps {
    horizontalScrollTo: (position: number, smooth: boolean) => void;
    scrollToLeft: (smooth?: boolean) => void;
    scrollToRight: (smooth?: boolean) => void;
    columnsCount: number;
    stickyColumnsCount?: number;
    endStickyColumnsCount?: number;
    scrollToElement: (target: HTMLElement, align: TScrollIntoViewAlign, smooth: boolean) => void;
}

function Checkbox(props: {
    label: string;
    isChecked?: boolean;
    onChange?: (isChecked: boolean) => void;
}) {
    const [state, _setState] = React.useState(!!props.isChecked);
    const setState = (newState) => {
        _setState(newState);
        props.onChange?.(newState);
    };
    return (
        <>
            <input
                type={'checkbox'}
                id={`${props.label}`}
                checked={state}
                onChange={(e) => {
                    return setState(e.target.checked);
                }}
            />
            <label htmlFor={props.label}>{props.label}</label>
        </>
    );
}

export function HorizontalScrollToSelector(props: IProps): React.ReactElement {
    const [position, setPosition] = React.useState<number>(331);
    const [smooth, setSmooth] = React.useState<boolean>(false);
    const onClick = React.useCallback(() => {
        props.horizontalScrollTo(position, smooth);
    }, [props.horizontalScrollTo, position, smooth]);

    const [align, alignTumbler] = useTumbler<TScrollIntoViewAlign>(
        undefined,
        ['start', 'center', 'end', 'autoStart', 'autoCenter', 'autoEnd', 'auto'],
        'auto'
    );

    const elementParams = React.useMemo<{
        title: string;
        selector: string;
    }>(() => {
        const scrollableCount =
            props.columnsCount - props.stickyColumnsCount - props.endStickyColumnsCount;
        const columnIndex =
            scrollableCount % 2 === 0 ? scrollableCount / 2 : (scrollableCount - 1) / 2;

        return {
            title: `scrollTo ${columnIndex} column`,
            selector: `.controls-Grid__itemsContainer .controls-GridReact__row:nth-child(1) .controls-GridReact__cell:nth-child(${
                columnIndex + 1
            })`,
        };
    }, [props.columnsCount, props.endStickyColumnsCount, props.stickyColumnsCount]);

    return (
        <BaseSelector>
            <div className="tw-flex tw-flex-col">
                <div className="tw-flex controls-padding_bottom-s">
                    <button onClick={onClick} className="controls-margin_right-s">
                        horizontalScrollTo()
                    </button>

                    <input
                        type={'number'}
                        className={'controls-margin_right-s'}
                        style={{
                            width: 50,
                        }}
                        value={position}
                        onChange={(e) => {
                            if (!Number.isNaN(e.target.value)) {
                                setPosition(Number(e.target.value));
                            }
                        }}
                    />

                    <Checkbox label="smooth" onChange={setSmooth} />
                </div>
                <div className="tw-flex">
                    <button
                        className={'controls-margin_right-s'}
                        onClick={() => {
                            props.scrollToLeft(smooth);
                        }}
                    >
                        scrollToLeft()
                    </button>
                    <button
                        onClick={() => {
                            props.scrollToRight(smooth);
                        }}
                    >
                        scrollToRight()
                    </button>
                </div>
                <div className="tw-flex controls-padding_bottom-s">
                    <button
                        className={'controls-margin_right-s'}
                        onClick={() => {
                            props.scrollToElement(
                                document.querySelector(elementParams.selector),
                                align,
                                smooth
                            );
                        }}
                    >
                        {elementParams.title}
                    </button>
                    {alignTumbler}
                </div>
            </div>
        </BaseSelector>
    );
}
