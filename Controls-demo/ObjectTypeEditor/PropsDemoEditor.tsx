import { useState } from 'react';
import {
    BooleanType,
    NumberType,
    ObjectMeta,
    ObjectType,
    StringType,
} from 'Types/meta';
import {
    EditorsProvider,
    getAttributeTitle,
    ObjectTypeEditor,
    useParentTypes,
} from 'Controls-editors/object-type';
import {
    BooleanEditor,
    NumberEditor,
    ObjectEditor,
    StringEditor,
} from 'Controls-editors/properties';
import { createElement } from 'UICore/Jsx';
import 'css!DemoStand/Controls-demo';
import 'css!Controls-demo/ObjectTypeEditor/PropsDemoEditor';
import { PropsDemoEditorGroupHeader } from './PropsDemoEditorGroupHeader';
import { PropsDemoEditorLayout } from './PropsDemoEditorLayout';

const defaultEditors = {
    [StringType.getId()]: StringEditor,
    [NumberType.getId()]: NumberEditor,
    [BooleanType.getId()]: BooleanEditor,
    [ObjectType.getId()]: ObjectEditor,
};

export function PropsDemoEditor({
    metaType,
    control,
}: {
    metaType: ObjectMeta<any>;
    control: any;
}) {
    const [props, setProps] = useState(metaType.getDefaultValue() || {});
    const [root, setRoot] = useState('');

    const back = () => {
        return setRoot(root.split('.').filter(Boolean).slice(0, -1).join('.'));
    };

    const parents = useParentTypes(metaType, root);
    const header = [
        metaType.getTitle(),
        ...root
            .split('.')
            .filter(Boolean)
            .map((name, index) => {
                return parents[index].getTitle() ?? getAttributeTitle(name);
            }),
    ];

    const backDisabled = !root.length;

    return (
        <div>
            <div className="PropsDemoEditor__header">
                <button
                    onClick={back}
                    className="PropsDemoEditor__back-button"
                    disabled={backDisabled}
                >
                    &lt;
                </button>{' '}
                {header.join(' / ')}
            </div>
            <div className="PropsDemoEditor__Content">
                <div className="PropsDemoEditor__PropertyGrid">
                    <EditorsProvider value={defaultEditors}>
                        <ObjectTypeEditor
                            metaType={metaType}
                            value={props}
                            onChange={setProps}
                            GroupHeaderComponent={PropsDemoEditorGroupHeader}
                            EditorLayoutComponent={PropsDemoEditorLayout}
                            root={root}
                            onRootChange={setRoot}
                        />
                    </EditorsProvider>
                </div>
                <div style={{ minWidth: 300, marginLeft: 20 }}>
                    <div style={{ marginBottom: 20 }}>
                        {createElement(
                            control,
                            {
                                ...props,
                            } /* Копируем props, потому-что createElement мутирует его */
                        )}
                    </div>
                    <pre>{JSON.stringify(props, null, 2)}</pre>
                </div>
            </div>
        </div>
    );
}
