import { ContentObserverComponent } from 'Controls/columnScrollReact';
import useGridSeparatedRowStyles, {
    IUseGridSeparatedRowStylesProps,
} from './useGridSeparatedRowStyles';
import { QA_SELECTORS } from '../../../common/data-qa';

// TODO: Убрать после
//  https://online.sbis.ru/opendoc.html?guid=ad3356a9-0caf-4acf-8679-3dd6b6a3d711&client=3
// eslint-disable-next-line @typescript-eslint/no-empty-interface
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
