import { useResetAfterDataSetChange } from './hooks/useResetAfterDataSetChange';

interface IResetEditorProps {
    onChange: Function;
    connectedPropName: string;
}

const DEFAULT_VALUES = {
    series: [],
    fields: [],
};

function LinearChartResetEditor({ onChange, connectedPropName = 'name' }: IResetEditorProps) {
    useResetAfterDataSetChange(connectedPropName, onChange, DEFAULT_VALUES);
    return null;
}

LinearChartResetEditor.displayName =
    'Controls-Graphs-editors/LinearChartResetEditor:LinearChartResetEditor';

export { LinearChartResetEditor };
