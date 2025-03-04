import { useResetAfterDataSetChange } from './hooks/useResetAfterDataSetChange';

interface IResetEditorProps {
    onChange: Function;
    connectedPropName: string;
}

const DEFAULT_VALUES = {
    series: [],
};

function ColumnChartResetEditor({ onChange, connectedPropName = 'name' }: IResetEditorProps) {
    useResetAfterDataSetChange(connectedPropName, onChange, DEFAULT_VALUES);
    return null;
}

ColumnChartResetEditor.displayName =
    'Controls-Graphs-editors/ColumnChartResetEditor:ColumnChartResetEditor';

export { ColumnChartResetEditor };
