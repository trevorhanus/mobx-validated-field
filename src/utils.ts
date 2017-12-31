export type orCallback = () => any;

export function isOr<T>(isVal: T | undefined, orVal: T | orCallback): T {
    if (isVal != null) {
        return isVal;
    } else {
        return typeof orVal === 'function' ? orVal() : orVal;
    }
}
