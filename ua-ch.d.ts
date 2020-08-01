// https://wicg.github.io/ua-client-hints/#interface

interface NavigatorUABrandVersion {
    brand: string;
    version: string;
}

interface UADataValues {
    platform: string;
    platformVersion: string;
    architecture: string;
    model: string;
    uaFullVersion: string;
}

interface NavigatorUAData {
    readonly brands: ReadonlyArray<NavigatorUABrandVersion>;
    readonly mobile: boolean;
    getHighEntropyValues(hints: (keyof UADataValues)[]): PromiseLike<UADataValues>;
}

interface Navigator {
    readonly userAgentData: NavigatorUAData;
}
