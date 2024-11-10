import { IPropertyEditorProps } from 'Meta/types';

/**
 * Редактор получает из контекста и отображает список хобби
 * @param {IMyEditorProps} props
 * @return {JSX.Element}
 * @constructor
 */
function HobbyEditor(props: IPropertyEditorProps<string>) {
    const { LayoutComponent, hobby } = props;

    if (!hobby) {
        return <>Отсутствует слайс в контексте</>;
    }
    const listItems = hobby.map((hobby) => <li>{hobby}</li>);

    return (
        <LayoutComponent>
            <ul>{listItems}</ul>
        </LayoutComponent>
    );
}

HobbyEditor.sourceConfigGetter =
    'Controls-editors-demo/PropertyGrid/EditorDataLoader/DataFactory:EditorDataConfigGetter';

export default HobbyEditor;
