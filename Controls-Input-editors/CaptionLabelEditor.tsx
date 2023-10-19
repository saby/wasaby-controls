import { LabelEditor, ILabelEditorProps } from './LabelEditor';
import { Checkbox } from 'Controls/checkbox';
import { memo, useMemo } from 'react';
import * as rk from 'i18n!Controls-editors';


interface ICaptionLabelEditorProps extends ILabelEditorProps {
}

interface IContentTemplateProps {
    itemValue?: string;
    itemCaption?: string;
}

function ContentTemplate(props: IContentTemplateProps) {
    switch (props.itemValue) {
        case 'captionStart':
            return <Checkbox value={true} captionPosition='start' caption={props.itemCaption}/>;
        case 'captionEnd':
            return <Checkbox value={true} captionPosition='end' caption={props.itemCaption}/>;
        default:
            return <Checkbox value={true}/>;
    }
}

export const CaptionLabelEditor = memo((props: ICaptionLabelEditorProps) => {
    const data = useMemo(() => {
        return [
            {
                caption: rk('Отсутствует'),
                value: 'hidden',
            },
            {
                caption: rk('Текстом слева'),
                menuCaption: rk('Метка слева'),
                value: 'start',
            },
            {
                caption: rk('Текстом сверху'),
                menuCaption: rk('Метка сверху'),
                value: 'top',
            },
            {
                caption: rk('Подпись после чекбокса'),
                value: 'captionEnd',
                isLabelHidden: true
            },
            {
                caption: rk('Подпись перед чекбоксом'),
                value: 'captionStart',
                isLabelHidden: true
            },
        ];
    }, []);
    return <LabelEditor
        {...props}
        customData={data}
        Control={ContentTemplate}
        onChange={props.onChange}
    />;
});