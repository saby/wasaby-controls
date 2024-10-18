import { IPropertyGridPopup, PropertyGridContextProxy } from 'Controls-editors/propertyGridPopup';
import { useEditorData } from 'Controls-editors/object-type';

/**
 * Редактор получает из контекста и отображает список хобби
 * @param {IMyEditorProps} props
 * @return {JSX.Element}
 * @constructor
 */
function CustomPropertyGrid(props: IPropertyGridPopup) {
    return (
        <div>
            <h1>Custom propertyGrid template</h1>
            <PropertyGridContextProxy {...props}>
                <CustomPropertyGridContent {...props} />
            </PropertyGridContextProxy>
        </div>
    );
}

function CustomPropertyGridContent(props: IPropertyGridPopup) {
    const editorType = props.metaType.getId();
    const hobbiesList = useEditorData(editorType);

    if (!hobbiesList) {
        return <>Отсутствует слайс в контексте</>;
    }
    const listItems = hobbiesList.hobby.map((hobby) => <li>{hobby}</li>);

    return <ul>{listItems}</ul>;
}

CustomPropertyGrid.sourceConfigGetter =
    'Controls-editors-demo/PropertyGrid/EditorDataLoader/DataFactory:EditorDataConfigGetter';
CustomPropertyGrid.isReact = true;

export default CustomPropertyGrid;
