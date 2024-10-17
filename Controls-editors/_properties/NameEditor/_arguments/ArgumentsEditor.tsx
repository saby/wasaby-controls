import { useEffect, useState, useCallback, useMemo } from 'react';
import { PropertyGrid } from 'Controls-editors/propertyGrid';
import { getArgumentsMeta, packArgumentValues, unpackArgumentValues } from './ArgumentsMetaFactory';
import * as translate from 'i18n!Controls-editors';
import { IFunctionCallMeta, RETURN_VALUE_FIELD } from './types';
import { IFunctionField } from 'Frame/base';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import 'css!Controls-editors/_properties/NameEditor/_arguments/ArgumentsEditor';

type IArgumentsEditorProps = IPropertyGridPropertyEditorProps<IFunctionField>;

const ARGUMENTS_EDITOR_GRID_ROW = {
    display: 'block',
    gridColumnEnd: 4,
    gridColumnStart: 1,
};

function ArgumentsEditor(props: IArgumentsEditorProps) {
    const { value, onChange } = props;

    const [metaType, setMetaType] = useState<IFunctionCallMeta | undefined>();

    const objectName = getObjectName(props);
    const methodName = getMethodName(props);

    const fetchMeta = async () => {
        const meta = await getArgumentsMeta(objectName, methodName);
        setMetaType(meta);
    };

    useEffect(() => {
        fetchMeta();
    }, [objectName, methodName]);

    const argumentValues = useMemo(() => {
        return unpackArgumentValues(value?.factory.arguments);
    }, [value]);

    const onAttributeValueChanged = useCallback(
        (argumentValue) => {
            value.factory.arguments = packArgumentValues(objectName, methodName, argumentValue);
            onChange({ ...value });
        },
        [value]
    );

    const onReturnValueChanged = useCallback(
        (res) => {
            value.factory.result = res[RETURN_VALUE_FIELD];
            onChange(value);
        },
        [value]
    );

    if (!metaType || !metaType.arguments) {
        return null;
    }

    return (
        <div style={ARGUMENTS_EDITOR_GRID_ROW}>
            <PropertyGrid
                metaType={metaType.arguments}
                captionColumnWidth="30%"
                value={argumentValues}
                onChange={onAttributeValueChanged}
            />
            {metaType.returnValue && (
                <>
                    <span className="controls_PropertyGrid__title controls-PropertyGrid-ArgumentsEditor__group-title">
                        {translate('Возвращаемое значение')}
                    </span>
                    <PropertyGrid
                        metaType={metaType.returnValue}
                        captionColumnWidth="30%"
                        value={value?.factory.result}
                        onChange={onReturnValueChanged}
                    />
                </>
            )}
        </div>
    );
}

function getObjectName(props: IArgumentsEditorProps) {
    return props.value.factory.name[props.value.factory.name.length - 2];
}

function getMethodName(props: IArgumentsEditorProps) {
    return props.value.factory.name[props.value.factory.name.length - 1];
}

export { ArgumentsEditor };
