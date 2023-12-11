/**
 * @kaizen_zone 10186a4a-7303-4e81-9d11-c395e91cec99
 */
import * as React from 'react';
import { IControlProps } from 'Controls/interface';
import { IWasabyAttributes } from 'UICore/Executor';
import WrapURLs from './WrapURLs';
import { getAttrs } from 'Controls/baseDecorator';
import {applied} from 'Types/entity';
import 'css!Controls/extendedDecorator';

interface IMultilineTextDecoratorOptions extends IControlProps {
    /**
     * @name Controls/_extendedDecorator/MultilineText#value
     * @cfg {string} Текст для отображения
     */
    value: string;
    attrs?: IWasabyAttributes;
}

const LINE_BREAK_SEPARATOR = '\n';

/**
 * Графический контрол, служащий для отображения в верстке многострочного текста.
 *
 * @remark
 * Служит для корректного отображения многострочного текста введенного через контрол Controls/input:Area
 *
 * @class Controls/_extendedDecorator/MultilineText
 * @implements Controls/interface:IControl
 * @public
 * @demo Controls-demo/Decorators/MultilineText/Index
 *
 */
export default React.memo(function MultilineText(
    props: IMultilineTextDecoratorOptions
): React.ReactElement {
    const textLines: string[] = getTextLinesList(props.value !== undefined ? props.value : '');
    const mainClass = 'controls-MultilineText-container';
    function getTextLinesList(text: string): string[] {
        return text?.split(LINE_BREAK_SEPARATOR) || [];
    }

    function isUseWrapUrls(text: string = ''): boolean {
        return !!text.match(/(http)|(ftp)|(file)|(notes)|(Notes)|(@)|(\\)/g);
    }

    const result: JSX.Element[] = [];

    textLines.forEach((text, index) => {
        const uniqId = applied.Guid.create();
        if (index > 0) {
            result.push(<br key={'br_' + uniqId} />);
        }
        if (text !== '') {
            if (isUseWrapUrls(text)) {
                const WrapURLsComponent = (
                    <WrapURLs value={text}
                              className='controls-MultilineText-display_wrapper'
                              tabIndex={null}
                              key={'WrapURLs_' + uniqId}
                    />
                );
                result.push(WrapURLsComponent);
            } else {
                result.push(
                    <div className="controls-MultilineText-display_wrapper" key={'text_' + uniqId}>
                        {text}
                    </div>
                );
            }
        }
    });

    return (
        <span {...getAttrs(props.attrs, props.className, mainClass)}
              ref={props.$wasabyRef}
              data-qa={props['data-qa']}
        >
            {result}
        </span>
    );
});
