import {bootstrap}    from "angular2/platform/browser";
import {ROUTER_PROVIDERS, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {AppComponent} from "./routes";



bootstrap(AppComponent, [
    ROUTER_PROVIDERS
]);
