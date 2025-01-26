/**
 * Действие создания доверенности.
 *
 * @public
 */
export default class CreatePowerOfAttorney {
    execute(): void {
        import('PowerOfAttorney/Operations/open').then(({ open }) => {
            open();
        });
    }
}