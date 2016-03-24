import {bootstrap}    from "angular2/platform/browser";
import {AppComponent} from "./components/app.component";
import {ROUTER_PROVIDERS, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';


//
//
bootstrap(AppComponent, [
    ROUTER_PROVIDERS
]);
