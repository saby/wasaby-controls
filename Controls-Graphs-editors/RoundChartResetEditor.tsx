import { useResetAfterDataSetChange } from './hooks/useResetAfterDataSetChange';

interface IResetEditorProps {
    onChange: Function;
    connectedPropName: string;
}

const DEFAULT_VALUES = {
    series: [],
    size: 's',
    type: 'donut',
    fields: [],
};

function RoundChartResetEditor({ onChange, connectedPropName = 'name' }: IResetEditorProps) {
    useResetAfterDataSetChange(connectedPropName, onChange, DEFAULT_VALUES);
    return null;
}

RoundChartResetEditor.displayName =
    'Controls-Graphs-editors/RoundChartResetEditor:RoundChartResetEditor';

export { RoundChartResetEditor };
