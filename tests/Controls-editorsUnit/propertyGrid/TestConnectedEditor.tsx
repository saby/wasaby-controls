import { useConnectedValue } from 'Controls-DataEnv/context';

export default function TestConnectedEditor(props: { name: string[] }) {
    const { value } = useConnectedValue(props.name);

    return <div className={'test-data'}>{value}</div>;
}
