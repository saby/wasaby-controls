import { useSlice, RootContextProvider } from 'Controls-DataEnv/context';
import type { Slice } from 'Controls-DataEnv/slice';
import { IPropertyGridPopup } from 'Controls-editors/propertyGridPopup';

/**
 * Редактор получает из контекста и отображает список хобби
 * @param {IMyEditorProps} props
 * @return {JSX.Element}
 * @constructor
 */
function CustomPropertyGrid(props: IPropertyGridPopup) {
    const { editorData } = props;

    return (
        <div>
            <h1>Custom propertyGrid template</h1>
            <RootContextProvider dataConfigs={editorData}>
                <CustomPropertyGridContent />
            </RootContextProvider>
        </div>
    );
}

function CustomPropertyGridContent() {
    const hobbiesList = useSlice<Slice<string[]>>('hobby');

    if (!hobbiesList) {
        return <>Отсутствует слайс в контексте</>;
    }
    const listItems = hobbiesList.state.map((hobby) => <li>{hobby}</li>);

    return <ul>{listItems}</ul>;
}

CustomPropertyGrid.sourceConfigGetter =
    'Controls-editors-demo/PropertyGrid/EditorDataLoader/DataFactory:EditorDataConfigGetter';

export default CustomPropertyGrid;
