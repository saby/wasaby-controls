import { Text } from 'Controls/input';
import { IPropertyEditorProps } from 'Meta/types';

export const TitleEditor = function (props: IPropertyEditorProps<string>) {
    const { onChange, value } = props;
    return (
        <Text
            fontWeight="bold"
            fontColorStyle="default"
            inlineHeight="l"
            fontSize="xl"
            value={value}
            onValueChanged={onChange}
            placeholder="Редактировать заголовок"
        />
    );
};
