/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import * as React from 'react';

type TThumbDefaultProps = {
    className?: string;
    size: 's' | 'l';
    thumbStyle: 'accented' | 'unaccented';
    hasEndPadding: boolean;
    hasStartPadding: boolean;
};

export type TThumbProps = Partial<TThumbDefaultProps> & {
    direction: 'vertical' | 'horizontal';
    style?: React.CSSProperties;
    isDragging?: boolean;

    onMouseDown?: React.MouseEventHandler;
};

export type TThumbRef = React.ForwardedRef<HTMLDivElement>;

function useClasses(props: TThumbProps): {
    wrapper: string;
    content: string;
} {
    const wrapper = React.useMemo(() => {
        const classes = [
            'controls-VScrollbar__thumbWrapper',
            `controls-VScrollbar__thumbWrapper_size-${props.size}`,
            `controls-VScrollbar__thumbWrapper_${props.direction}`,
        ];

        if (props.direction === 'vertical') {
            classes.push(
                `controls-padding_top-${props.hasStartPadding ? 'm' : '3xs'}`,
                `controls-padding_bottom-${props.hasEndPadding ? 'm' : '3xs'}`
            );
        } else {
            classes.push(
                `controls-padding_left-${props.hasStartPadding ? 'm' : '3xs'}`,
                `controls-padding_right-${props.hasEndPadding ? 'm' : '3xs'}`
            );
        }

        return classes.join(' ');
    }, [props.direction, props.hasEndPadding, props.hasStartPadding, props.size]);

    const content = React.useMemo(() => {
        const classes = [
            'controls-VScrollbar__thumb',
            `controls-VScrollbar__thumb_${props.thumbStyle}`,
            `controls-VScrollbar__thumb_size-${props.size}`,
            `controls-VScrollbar__thumb_${props.thumbStyle}_${props.direction}`,
            `controls-VScrollbar__thumb_${props.direction}`,
            `controls-VScrollbar__thumb_${props.direction}_size-${props.size}`,
        ];

        if (props.isDragging) {
            classes.push(
                `controls-VScrollbar__thumb_dragging_size-${props.size}`,
                `controls-VScrollbar__thumb_dragging_${props.thumbStyle}`
            );
        }

        return classes.join(' ');
    }, [props.direction, props.isDragging, props.size, props.thumbStyle]);

    return {
        wrapper,
        content,
    };
}

function Thumb(props: TThumbProps, ref: TThumbRef): React.JSX.Element {
    const { wrapper, content } = useClasses(props);
    return (
        <div ref={ref} className={wrapper} style={props.style} onMouseDown={props.onMouseDown}>
            <div className={content} data-qa="VScrollbar__thumb" />
        </div>
    );
}

const DEFAULT_PROPS: Required<TThumbDefaultProps> = {
    className: '',
    size: 'l',
    thumbStyle: 'accented',
    hasStartPadding: false,
    hasEndPadding: false,
};

const ThumbForwarded = React.forwardRef(Thumb);
ThumbForwarded.defaultProps = DEFAULT_PROPS;

const ThumbForwardedMemo = React.memo(ThumbForwarded);
export default ThumbForwardedMemo;
