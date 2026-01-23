// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const apiUrl =  'https://api.cloudpg.xyz/api/v1/'; //
const apiUrlTwo =  'https://api.lios.xyz/api/v1/';


export const environment = {
  production: false,
  isMockEnabled: false, // You have to switch this, when your real back-end is done
  authTokenKey: 'authce9d77b308c149d5992a80073637e4d5',
  //apiUrl: 'https://report.lios.limanlar.gov.ct.tr/api/v1/',
  //reportUrl: 'https://report.lios.limanlar.gov.ct.tr/'
  apiUrl: 'http://lios.runasp.net/api/v1/',
  reportUrl: 'https://report.lios.limanlar.gov.ct.tr/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
