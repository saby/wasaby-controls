import { IPropertyEditorProps } from 'Meta/types';
import { useSlice } from 'Controls-DataEnv/context';
import type { Slice } from 'Controls-DataEnv/slice';

/**
 * Редактор получает из контекста и отображает список хобби
 * @param {IMyEditorProps} props
 * @return {JSX.Element}
 * @constructor
 */
function HobbyEditor(props: IPropertyEditorProps<string>) {
    const { LayoutComponent } = props;
    const hobbiesList = useSlice<Slice<string[]>>('hobby');

    if (!hobbiesList) {
        return <>Отсутствует слайс в контексте</>;
    }
    const listItems = hobbiesList.state.map((hobby) => <li>{hobby}</li>);

    return (
        <LayoutComponent>
            <ul>{listItems}</ul>
        </LayoutComponent>
    );
}

HobbyEditor.sourceConfigGetter =
    'Controls-editors-demo/PropertyGrid/EditorDataLoader/DataFactory:EditorDataConfigGetter';

export default HobbyEditor;
