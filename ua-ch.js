/// <reference path="ua-ch.d.ts" />

(function(Promise, Symbol) {
    'use struct';

    if ('userAgentData' in navigator)
        return;

    const promisify = Promise ?
    /**
     * @template T
     * @param {T | PromiseLike<T>} value
     * @returns {PromiseLike<T>}
     */
    function(value) {
        return Promise.resolve(value);
    } :
    /**
     * @template T
     * @param {T | PromiseLike<T>} value
     * @returns {PromiseLike<T>}
     */
    function(value) {
        return value && 'then' in value ? value : {
            then: function(onfulfilled) {
                return promisify(onfulfilled(value));
            }
        };
    };

    const userAgent = navigator.userAgent;

    /** @type {NavigatorUABrandVersion[]} */
    const brands = [];
    /** @type {boolean} */
    const mobile = /\bMobile\b/.test(userAgent);
    /** @type {UADataValues} */
    const values = {
        platform       : '',
        platformVersion: '',
        architecture   : '',
        model          : '',
        uaFullVersion  : '',
    };
    if (/\b(?:Chrome|CrMo|CriOS)\/((\d+)\.[\d.]+)/.test(userAgent) && !/\bEdge\//.test(userAgent)) {
        brands.push({ brand: 'Chromium', version: RegExp.$2 });
        brands.push({ brand: '"Not\\A;Brand', version: '99' });
        values.uaFullVersion = RegExp.$1;
    }
    if (/\bEdg(?:e|iOS|A)?\/((\d+)\.[\d.]+)/.test(userAgent)) {
        brands.push({ brand: 'Microsoft Edge', version: RegExp.$2 });
        values.uaFullVersion = RegExp.$1;
    }
    if (/\bOPR\/((\d+)\.[\d.]+)/.test(userAgent)) {
        brands.push({ brand: 'Opera', version: RegExp.$2 });
        values.uaFullVersion = RegExp.$1;
    }
    if (/\bSamsungBrowser\/((\d+)\.[\d.]+)/.test(userAgent)) {
        brands.push({ brand: 'Samsung Internet', version: RegExp.$2 });
        values.uaFullVersion = RegExp.$1;
    }
    if (/\bUCBrowser\/((\d+)\.[\d.]+)/.test(userAgent)) {
        brands.push({ brand: 'UC Browser', version: RegExp.$2 });
        values.uaFullVersion = RegExp.$1;
    }
    if (/\bTrident\/(\d+)/.test(userAgent)) {
        brands.push({ brand: 'Internet Explorer', version: +RegExp.$1 + 4 + '' });
        values.uaFullVersion = +RegExp.$1 + 4 + '.0';
    }
    if (/\b(?:Firefox|FxiOS)\/((\d+)\.[\d.]+)/.test(userAgent)) {
        brands.push({ brand: 'Firefox', version: RegExp.$2 });
        values.uaFullVersion = RegExp.$1;
    }
    if (!brands.length && /\bSafari\//.test(userAgent) && /\bVersion\/((\d+)\.[\d.]+)/.test(userAgent)) {
        brands.push({ brand: 'Safari', version: RegExp.$2 });
        values.uaFullVersion = RegExp.$1;
    }
    if (!brands.length && /\bAppleWebKit\/([\d+.]+)/.test(userAgent)) {
        brands.push({ brand: 'WebKit', version: RegExp.$1 });
        values.uaFullVersion = RegExp.$1;
    }
    if (brands.length < 3 && brands[0].brand === 'Chromium') {
        brands.push({ brand: 'Google Chrome', version: brands[0].version });
    }
    if (/\b(Xbox(?: One)?)\b/.test(userAgent)) {
        values.platform = RegExp.$1;
    } else if (/\bWindows NT ([\d+.]+)/.test(userAgent)) {
        values.platform = 'Windows';
        values.platformVersion = RegExp.$1;
    } else if (/\bAndroid ([\d_]+)/.test(userAgent)) {
        values.platform = 'Android';
        values.platformVersion = RegExp.$1;
    } else if (/([\d_]+) like Mac OS X\b/.test(userAgent)) {
        values.platform = 'iOS';
        values.platformVersion = RegExp.$1;
    } else if (/\bMac OS X ([\d_.]+)/.test(userAgent)) {
        values.platform = 'Mac OS X';
        values.platformVersion = RegExp.$1;
    } else if (/\bPlatStation (\d+)/.test(userAgent)) {
        values.platform = 'PlayStation';
        values.platformVersion = RegExp.$1;
    } else if (/\b(Linux|(?:Free|Net|Open)BSD)\b/.test(userAgent)) {
        values.platform = RegExp.$1;
    }

    const NavigatorUAData = function() {
        Object.defineProperties(this, {
            brands: { enumerable: true, value: Object.freeze(brands) },
            mobile: { enumerable: true, value: mobile },
        });
    };
    if (Symbol && Symbol.toStringTag) {
        NavigatorUAData.prototype[Symbol.toStringTag] = 'NavigatorUAData';
    } else {
        NavigatorUAData.prototype.toString = function() { return '[object NavigatorUAData]'; };
    }
    /**
     * @param {(keyof UADataValues)[]} hints
     * @returns {PromiseLike<UADataValues>}
     */
    NavigatorUAData.prototype.getHighEntropyValues = function(hints) {
        if (arguments.length === 0)
            throw new TypeError("Failed to execute 'getHighEntropyValues' on 'NavigatorUAData': 1 argument required, but only 0 present.");
        if (typeof hints !== 'object' || typeof hints.forEach !== 'function')
            throw new TypeError("Failed to execute 'getHighEntropyValues' on 'NavigatorUAData': The provided value cannot be converted to a sequence.");
        /** @type {UADataValues} */
        const result = {};
        hints.forEach(function(hint) { if (hint in values) result[hint] = values[hint]; });
        return promisify(result);
    };

    Object.defineProperties(navigator, {
        userAgentData: { enumerable: true, value: new NavigatorUAData }
    });
})(window.Promise, window.Symbol);
