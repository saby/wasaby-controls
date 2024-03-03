export function isRenderer(template: unknown): boolean {
    const memoSymbol = Symbol.for('react.memo');
    const forwardRefSymbol = Symbol.for('react.forward_ref');

    return (
        template?.isWasabyTemplate ||
        typeof template === 'function' ||
        template?.$$typeof === memoSymbol ||
        template?.$$typeof === forwardRefSymbol
    );
}
