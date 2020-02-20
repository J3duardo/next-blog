import getConfig from "next/config";
const {publicRuntimeConfig} = getConfig();

export const API = process.env.PRODUCTION ? "https://thenextblog-api.herokuapp.com" : "http://localhost:8000";
export const APP_NAME = process.env.APP_NAME;

let domain = null;

if(!process.env.PRODUCTION) {
  domain = process.env.DOMAIN_DEV
} else {
  domain = process.env.DOMAIN_PROD
}

export const DOMAIN = domain;

export const DISQUS_SHORTNAME = process.env.DISQUS_SHORTNAME;

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;