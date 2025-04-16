import { useStrictSlice } from 'Controls-DataEnv/context';
import { useEffect } from 'react';

export interface ITestWidgetProps {
    storeId: string;
    getSlice: Function;
}

export default function TestWidget(props: ITestWidgetProps): JSX.Element {
    const slice = useStrictSlice(props.storeId);

    useEffect(() => {
        if (props.getSlice) {
            props.getSlice(props.storeId, slice);
        }
    }, []);

    return <div data-qa={props.storeId}>{slice.state.value}</div>;
}
