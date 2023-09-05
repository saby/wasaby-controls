import { ContentObserverComponent } from 'Controls/columnScrollReact';
import useGridSeparatedRowStyles, {
    IUseGridSeparatedRowStylesProps,
} from './useGridSeparatedRowStyles';
import { QA_SELECTORS } from '../../../common/data-qa';

export interface IContentObserverRowProps extends Omit<IUseGridSeparatedRowStylesProps, 'part'> {}

export default function ContentObserverRow(props: IContentObserverRowProps): JSX.Element {
    const { fixedCellStyle, scrollableCellStyle } = useGridSeparatedRowStyles(props);

    return (
        <div className="tw-contents" data-qa={QA_SELECTORS.CONTENT_OBSERVER}>
            <ContentObserverComponent
                fixedDiv={<div style={fixedCellStyle} />}
                scrollableDiv={<div style={scrollableCellStyle} />}
            />
        </div>
    );
}
