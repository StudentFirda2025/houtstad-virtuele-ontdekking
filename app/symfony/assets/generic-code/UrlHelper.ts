export class UrlHelper {
    public static getUrlParameter(name: string): string | null {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }
}