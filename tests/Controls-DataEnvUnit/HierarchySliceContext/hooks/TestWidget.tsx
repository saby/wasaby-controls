import { useStrictSlice } from 'Controls-DataEnv/context';
import { useEffect } from 'react';

export interface ITestWidgetProps {
    storeId: string;
}

export default function TestWidget(props: ITestWidgetProps): JSX.Element {
    const slice = useStrictSlice(props.storeId);

    useEffect(() => {
        if (props.value) {
            slice.setState({
                value: props.value,
            });
        }
    }, [props.value]);

    return <div data-qa={'Test_Widget'}>{slice.state.value}</div>;
}
