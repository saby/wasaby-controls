export default function (loadResult: Record<string, unknown>) {
    loadResult.afterLoadCallback = true;
}
