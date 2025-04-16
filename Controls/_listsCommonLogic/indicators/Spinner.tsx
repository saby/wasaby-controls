import type { ReactElement } from 'react';

const SPINNER_BEAM_COUNTER = 12;

export default function Spinner() {
    const spinnerBeams: ReactElement[] = [];
    for (let i = 0; i < SPINNER_BEAM_COUNTER; i++) {
        spinnerBeams.push(
            <div
                key={i}
                className={`controls-BaseControl__spinner-beam controls-BaseControl__spinner-beam-${i}`}
            />
        );
    }
    return <div className="controls-BaseControl__spinner">{spinnerBeams}</div>;
}
