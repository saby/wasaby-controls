import * as React from 'react';

interface IValignSwitcher {
    valign: 'start' | 'center';
    setValign: () => void;
}

function ValignSwitcher(props: IValignSwitcher) {
    const { valign, setValign } = props;
    const onChange = React.useCallback(
        (e: Event) => {
            setValign(e.target.value);
        },
        [valign, setValign]
    );
    return (
        <div>
            <span>valign: </span>
            <select onChange={onChange} value={valign}>
                <option value={'center'}>center</option>
                <option value={'start'}>start</option>
            </select>
        </div>
    );
}

export default ValignSwitcher;
