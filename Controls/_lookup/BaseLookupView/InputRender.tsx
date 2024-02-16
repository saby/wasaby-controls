/**
 * @kaizen_zone 1194f522-9bc3-40d6-a1ca-71248cb8fbea
 */
import {
    generateStates,
    getReactContentTemplate as getContent,
    ITextInputOptions,
    Render,
    Text,
} from 'Controls/input';
import 'css!Controls/lookup';
import { wasabyAttrsToReactDom } from 'UICore/Executor';

class InputRenderLookup extends Text {
    _defaultInput = null;

    constructor(props) {
        super(props);
        this._mouseEnterHandler = this._mouseEnterHandler.bind(this);
        generateStates(this, props);
    }

    shouldComponentUpdate(nextProps: ITextInputOptions, nextState): boolean {
        const res = super.shouldComponentUpdate(nextProps, nextState);
        generateStates(this, nextProps);
        return res;
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this._defaultInput = null;
    }

    protected _getField() {
        if (this.props.isInputVisible) {
            return super._getField.call(this);
        } else {
            // В поле связи с единичным выбором после выбора записи
            // скрывается инпут (технически он в шаблоне создаётся под if'ом),
            // но базовый input:Text ожидает, что input в вёрстке есть всегда.
            // Для корректной работы создаём виртуальный input.
            // Если его скрывать через display: none, то начинаются проблемы с фокусом,
            // поэтому данный способ нам не подходит.
            return this._getDefaultInput();
        }
    }

    protected _getReadOnlyField(): HTMLElement {
        // В поле связи с единичным выбором не строится input
        // Подробнее в комментарии в методе _getField
        if (this.props.isInputVisible) {
            return super._getReadOnlyField.call(this);
        } else {
            return this._getDefaultInput();
        }
    }

    protected _getDefaultInput() {
        if (!this._defaultInput) {
            const nativeInput: HTMLInputElement = document.createElement('input');
            this._defaultInput = {
                setValue: () => {
                    return undefined;
                },
                setCaretPosition: () => {
                    return undefined;
                },
                setSelectionRange: () => {
                    return undefined;
                },
                getFieldData: (name: string) => {
                    return nativeInput[name];
                },
                hasHorizontalScroll: () => {
                    return false;
                },
                paste: () => {
                    return undefined;
                },
                getContainer: () => {
                    return undefined;
                },
            };
        }

        return this._defaultInput;
    }

    protected _keyDownInput(event): void {
        this._keyDownHandler(event);
        if (!event?.isPropagationStopped?.()) {
            this.props.onKeyDownInput?.(event, event);
        }
    }

    protected _isCommentStyled() {
        return (
            this.props.fontColorStyle !== 'default' ||
            this.props.fontSize !== 'm' ||
            this.props.fontWeight ||
            this.props.inlineHeight !== 'default'
        );
    }

    protected _getContent(contentProps = {}) {
        const attrs = wasabyAttrsToReactDom(contentProps.attrs || {}) || {};
        const forComment = this.props.forComment;
        const commentClassName = `
                  ${forComment ? ' controls-Lookup__fieldWrapper_for_comment' : ''}
                  ${
                      forComment && !this._isCommentStyled()
                          ? ' controls-Lookup__fieldWrapper_for_comment-color'
                          : ''
                  }`;

        return this._getReadOnly() &&
            !this.props.multiline &&
            this.props.value &&
            this.props.forComment
            ? getContent(this._readOnlyField.template, {
                  ...attrs,
                  ...contentProps,
                  options: this.props,
                  ...this._readOnlyField.scope,
                  placeholderVisibility: this._placeholderVisibility,
                  value: this._viewModel.displayValue,
                  ref: this.readonlyFieldRef,
                  className: commentClassName,
                  onClick: this._clickHandler,
              })
            : this.props.isInputVisible
            ? getContent(this._field.template, {
                  ...attrs,
                  ...contentProps,
                  ...this._useEvent,
                  ref: this.fieldWrapperRef,
                  fieldNameRef: this.fieldNameRef,
                  forCalcRef: this.forCalcRef,
                  fakeFieldRef: this.fakeFieldRef,
                  type: this._type,
                  model: this._viewModel,
                  options: this.props,
                  ...this._field.scope,
                  readOnly: this._getReadOnly(),
                  fieldName: this._fieldName,
                  value: this._viewModel.displayValue,
                  isBrowserPlatform: this._isBrowserPlatform,
                  hidePlaceholderUsingCSS: this._hidePlaceholderUsingCSS,
                  isEdge: this._isEdge,
                  className: `controls-Lookup__fieldWrapper${
                      this.props.multiline
                          ? ' controls-Lookup__fieldWrapper-size-' + this._inlineHeight
                          : ''
                  } controls-Lookup__fieldWrapper_content_width_${
                      this.props.multiline && this.props.inputWidth ? 'custom' : 'default'
                  }
                  ${commentClassName}
                  controls-Lookup__fieldWrapper_style-${this.props.style}${
                      !this.props.multiLineOption &&
                      this.props.multiSelect &&
                      !this._getReadOnly() &&
                      !this.props.forComment
                          ? ' controls-Lookup__fieldWrapper_multiSelect'
                          : ''
                  }`,
                  style: { width: this.props.inputWidth + 'px' },
                  onKeyDown: this._keyDownInput.bind(this),
              })
            : null;
    }

    render() {
        const placeholder =
            this.props.placeholder &&
            (!this._getReadOnly() || this.props.placeholderVisibility === 'empty')
                ? () => {
                      return this.props.multiline ? (
                          <div className="controls-Lookup__placeholderWrapper">
                              {getContent(this.props.placeholder)}
                          </div>
                      ) : (
                          getContent(this.props.placeholder, {
                              className: `controls-Lookup__placeholder_style-${this.props.style}`,
                          })
                      );
                  }
                : null;
        const attrs = wasabyAttrsToReactDom(this.props.attrs || {}) || {};
        if (this._tooltip) {
            attrs.title = this._tooltip;
        }

        const style = typeof this.props.style === 'object' ? this.props.style : undefined;

        return (
            <Render
                ref={this._setRef}
                data-qa={this.props.dataQa || this.props['data-qa']}
                attrs={attrs}
                placeholder={placeholder}
                className={this.props.className ? this.props.className : ''}
                state={this._renderStyle()}
                viewModel={this._viewModel}
                style={style}
                selectOnClick={this.props.selectOnClick}
                multiline={this.props.multiline}
                tagStyle={this.props.tagStyle}
                textAlign={this.props.textAlign}
                fontSize={this._fontSize}
                inlineHeight={this._inlineHeight}
                fontColorStyle={this._fontColorStyle}
                borderStyle={this.props.borderStyle}
                validationStatus={this.props.validationStatus}
                borderVisibility={this.props.borderVisibility}
                contrastBackground={this.props.contrastBackground}
                fontWeight={this.props.fontWeight}
                onMouseEnter={this._mouseEnterHandler}
                onTagClick={this.props.onTagClick}
                onTagHover={this.props.onTagHover}
                onMouseDown={this._mouseDownHandler}
                onKeyDown={this._keyDownInput.bind(this)}
                leftFieldWrapper={this.props.leftFieldWrapper}
                rightFieldWrapper={this.props.rightFieldWrapper}
            >
                {this._getContent}
            </Render>
        );
    }
}

export default InputRenderLookup;
