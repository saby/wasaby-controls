import { Fragment, memo, ReactNode, useCallback, useContext, useState } from 'react';
import { DataSetBindingFacade } from 'Frame/base';
import { useBindingFacadeFromEditor } from 'Controls-editors/hooks';
import { Title } from 'Controls/heading';
import { ArrowButton } from 'Controls/extButtons';
import 'css!Controls-Graphs-editors/RoundChartDiagramEditor';
import { ObjectTypeEditorValueContext } from 'Controls-editors/object-type';
import { Label } from 'Controls/input';
import 'css!Controls-Graphs-editors/LinearChartColumnEditor';
import { RecordSet } from 'Types/collection';
import { SelectedKey } from 'Controls/source';
import { Control as Chips } from 'Controls/Chips';
import { ISingleSelectableOptions } from 'Controls/interface';
import * as translate from 'i18n!Controls-Graphs-editors';
import { Selector } from 'Controls/dropdown';

interface IRoundChartDiagramEditorProps {
    connectedPropName: string;
    LayoutComponent: unknown;
    onChange: Function;
}

const TYPE_VARIANTS = [
    { id: 'donut', caption: translate('Кольцевая') },
    { id: 'pie', caption: translate('Круговая') },
];

const TYPE_VARIANTS_RS = new RecordSet({
    keyProperty: 'id',
    rawData: TYPE_VARIANTS,
});

function ChipsIconTemplate(props: { caption: string; className: string }) {
    return (
        <div className={`${props.className} controlsGraphsEditors-roundChartDiagramEditor__chips`}>
            {props.caption}
        </div>
    );
}

const SIZE_VARIANTS = [
    {
        id: 's',
        iconOptions: {
            caption: 'S',
        },
        iconTemplate: ChipsIconTemplate,
    },
    {
        id: 'm',
        iconOptions: {
            caption: 'M',
        },
        iconTemplate: ChipsIconTemplate,
    },
    {
        id: 'l',
        iconOptions: {
            caption: 'L',
        },
        iconTemplate: ChipsIconTemplate,
    },
];

const SIZE_VARIANTS_RS = new RecordSet({
    keyProperty: 'id',
    rawData: SIZE_VARIANTS,
});

function Editor(props: { LayoutComponent: ReactNode; onChange: Function }) {
    const { LayoutComponent = Fragment, onChange } = props;
    const editorContext = useContext(ObjectTypeEditorValueContext);
    const arrowButtonClickHandler = useCallback(() => {}, []);
    const [roundChartType, setRoundChartType] = useState(() => {
        return editorContext.type ?? 'donut';
    });
    const handleChangeRoundChartType = useCallback(
        (keys: string) => {
            setRoundChartType(keys[0]);
            onChange({ ...editorContext, type: keys[0] }, { multiple: true });
        },
        [editorContext]
    );
    const [size, setSize] = useState(() => {
        return editorContext.size ?? 's';
    });
    const handleChangeSize = useCallback(
        (key: string) => {
            setSize(key);
            onChange({ ...editorContext, size: key }, { multiple: true });
        },
        [editorContext]
    );

    return (
        // @ts-expect-error JSX
        <LayoutComponent title={null}>
            <div className="controlsGraphsEditors__separator"></div>
            <div className="tw-flex tw-items-center tw-justify-between">
                <Title readOnly={true} caption={translate('Диаграмма')} />
                <ArrowButton className="tw-hidden" onClick={arrowButtonClickHandler} />
            </div>
            <div className="controlsGraphsEditors-roundChartDiagramEditor__editorsGrid">
                <Label caption={translate('Тип')} className="controls-inlineheight-l" />
                <Selector
                    selectedKeys={[roundChartType]}
                    onSelectedKeysChanged={handleChangeRoundChartType}
                    items={TYPE_VARIANTS_RS}
                    keyProperty="id"
                    displayProperty="caption"
                    className="controlsGraphsEditors__columnEditor"
                    buildByItems={true}
                />
                <Label caption={translate('Размер')} />
                <SelectedKey
                    selectedKey={size}
                    onSelectedKeyChanged={
                        handleChangeSize as ISingleSelectableOptions['onSelectedKeyChanged']
                    }
                >
                    <Chips items={SIZE_VARIANTS_RS} keyProperty="id" allowEmptySelection={false} />
                </SelectedKey>
            </div>
        </LayoutComponent>
    );
}

const RoundChartDiagramEditor = memo((props: IRoundChartDiagramEditorProps) => {
    const { connectedPropName } = props;

    const [bindingFacade] = useBindingFacadeFromEditor<DataSetBindingFacade>(connectedPropName);

    if (!bindingFacade) {
        return null;
    }

    return <Editor LayoutComponent={props.LayoutComponent} onChange={props.onChange} />;
});

RoundChartDiagramEditor.displayName =
    'Controls-Graphs-editors/RoundChartDiagramEditor:RoundChartDiagramEditor';

export { RoundChartDiagramEditor };
