import { IMarkerProps } from 'Controls/interface';

export function Marker(props: IMarkerProps) {
    if (!props.markerVisible) {
        return null;
    }

    return <div>marker</div>;
}
