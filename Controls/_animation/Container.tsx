import * as React from 'react';
import { AnimationContext } from './Context';
import { Logger } from 'UI/Utils';
import 'css!Controls/_animation/Container';

interface IStartAnimationParams {
    fromId: string;
    toId: string;
    fromPosition: number;
    toPosition: number;
    entity: object;
}

interface IAnimationContainerProps {
    animationTemplate: Function;
}

interface IAnimationContainerState {
    fromLocation: DOMRect | null;
    toLocation: DOMRect | null;
    animatedEntity: object | null;
    animationEntityStyle: React.CSSProperties;
}

interface IAnimationContainerContextValue {
    register: Function;
    startAnimation: Function;
    stopAnimation: Function;
}

interface IAnimationUser {
    getLocation: (position: number) => DOMRect;
    abortAnimation: () => void;
    id: string;
}

export const ANIMATION_DURATION = 500;

export class Container extends React.Component<
    IAnimationContainerProps,
    IAnimationContainerState
> {
    protected _contextValue: IAnimationContainerContextValue;
    protected _animationPromiseResolver?: Function;
    protected _users: { [key: string]: IAnimationUser } = {};

    constructor(props: IAnimationContainerProps) {
        super(props);
        this._contextValue = {
            register: this.register.bind(this),
            startAnimation: this.startAnimation.bind(this),
            stopAnimation: this.stopAnimation.bind(this),
        };
        this.state = {
            animationEntityStyle: null,
            animatedEntity: null,
            fromLocation: null,
            toLocation: null,
        };
        this.stopAnimation = this.stopAnimation.bind(this);
    }

    componentDidMount(): void {
        window.addEventListener('resize', this.stopAnimation, true);
        window.addEventListener('scroll', this.stopAnimation, true);
        window.addEventListener('mousedown', this.stopAnimation, true);
    }

    componentDidUpdate(
        prevProps: IAnimationContainerProps,
        prevState: IAnimationContainerState
    ): void {
        if (prevState.animatedEntity !== this.state.animatedEntity) {
            setTimeout(() => {
                this.setState({
                    animationEntityStyle: this.state.toLocation,
                });
            }, 0);
        }
    }

    register(user: IAnimationUser): void {
        this._users[user.id] = user;
    }

    startAnimation(params: IStartAnimationParams): Promise<void> {
        if (this.validateAnimationParams(params)) {
            const fromLocation = this._users[params.fromId].getLocation(
                params.fromPosition
            );
            this.setState({
                animatedEntity: params.entity,
                fromLocation,
                toLocation: this._users[params.toId].getLocation(
                    params.toPosition
                ),
                animationEntityStyle: fromLocation,
            });
            return new Promise((resolver) => {
                this._animationPromiseResolver = resolver;
                setTimeout(() => {
                    this.stopAnimation();
                }, ANIMATION_DURATION);
            });
        }
    }

    stopAnimation(): void {
        if (this.state.animatedEntity) {
            for (const key in this._users) {
                if (this._users.hasOwnProperty(key)) {
                    this._users[key].abortAnimation();
                }
            }
            this.setState({
                animationEntityStyle: null,
                animatedEntity: null,
                fromLocation: null,
                toLocation: null,
            });
            this._animationPromiseResolver();
            this._animationPromiseResolver = null;
        }
    }

    validateAnimationParams(params: IStartAnimationParams): boolean {
        let valid = true;
        if (!params.entity) {
            Logger.error(
                'Controls/animation:Container: Не передана сущность для анимации'
            );
            valid = false;
        }
        if (
            !this._users.hasOwnProperty(params.fromId) ||
            !this._users.hasOwnProperty(params.toId)
        ) {
            Logger.error(
                'Controls/animation:Container: Попытка вызвать анимацию незарегистрированным контролом'
            );
            valid = false;
        }
        return valid;
    }

    render(): JSX.Element {
        return (
            <AnimationContext.Provider value={this._contextValue}>
                {this.props.children}
                {this.state.animatedEntity ? (
                    <div
                        className={'Controls_animationContainer_entityTemplate'}
                        style={this.state.animationEntityStyle}
                    >
                        {this.props.animationTemplate({
                            entity: this.state.animatedEntity,
                        })}
                    </div>
                ) : null}
            </AnimationContext.Provider>
        );
    }
}
