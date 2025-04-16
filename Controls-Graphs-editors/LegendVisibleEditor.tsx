import { useEffect } from 'react';
import { IBaseEditorProps } from './interfaces/IBaseEditorProps';

function LegendVisibleEditor(props: IBaseEditorProps) {
    const { onChange, value = false } = props;

    useEffect(() => {
        if (!value) {
            onChange(true);
        }
    }, []);

    return null;
}

LegendVisibleEditor.displayName = 'Controls-Graphs-editors/LegendVisibleEditor:LegendVisibleEditor';

export { LegendVisibleEditor };
