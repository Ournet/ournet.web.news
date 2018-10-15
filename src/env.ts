
export type EnvData = {
    isProduction: boolean
}

export default {
    isProduction: process.env.NODE_ENV === 'production',
} as EnvData
