import { forwardRef, LegacyRef } from 'react';

interface ICounterProps {
    currentLength: number;
    maxLength: number;
}

export default forwardRef(function Counter(props: ICounterProps, ref: LegacyRef<HTMLSpanElement>) {
    return (
        <span
            ref={ref}
            className="controls-text-unaccented controls-InputBase__counter_container controls-fontsize-xs"
        >
            {props.currentLength}/{props.maxLength}
        </span>
    );
});
