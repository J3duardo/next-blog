import getConfig from "next/config";
const {publicRuntimeConfig} = getConfig();

export const API = publicRuntimeConfig.PRODUCTION ? "https://blog.com" : "http://localhost:8000";
export const APP_NAME = publicRuntimeConfig.APP_NAME;

let domain = null;

if(!publicRuntimeConfig.PRODUCTION) {
  domain = publicRuntimeConfig.DOMAIN_DEV
} else {
  domain = publicRuntimeConfig.DOMAIN_PROD
}

export const DOMAIN = domain;