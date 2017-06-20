
// These shims make it possible to use webpack url-loader to
// inline images without making the TS typechecker fail
declare module '*.svg' {
    var value: string
    export = value
}

declare module '*.png' {
    var value: string
    export = value
}

declare module '*.jpg' {
    var value: string
    export = value
}
