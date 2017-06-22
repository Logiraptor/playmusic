
// These shims make it possible to use webpack url-loader to
// inline images without making the TS typechecker fail
declare module '*.svg' {
    var value: string
    export default value
}

declare module '*.png' {
    var value: string
    export default value
}

declare module '*.jpg' {
    var value: string
    export default value
}

declare module '*.css' {
    var value: any
    export default value
}