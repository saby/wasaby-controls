import * as React from 'react';
import BaseSelector from '../../base/BaseSelector';

interface IProps {
    horizontalScrollTo: (position: number, smooth: boolean) => void;
}

export function HorizontalScrollToSelector(props: IProps): React.ReactElement {
    const [position, setPosition] = React.useState<number>(331);
    const [smooth, setSmooth] = React.useState<boolean>(false);
    const onClick = React.useCallback(() => {
        props.horizontalScrollTo(position, smooth);
    }, [props.horizontalScrollTo, position, smooth]);

    return (
        <BaseSelector header={'position'}>
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

            <button onClick={onClick} className={'controls-margin_right-s'}>
                horizontalScrollTo()
            </button>

            <input
                type={'checkbox'}
                id={'smooth_checkbox'}
                onChange={(e) => {
                    return setSmooth(e.target.checked);
                }}
            />
            <label htmlFor="smooth_checkbox">smooth</label>
        </BaseSelector>
    );
}
