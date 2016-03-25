import 'rxjs/add/operator/map';
import 'rxjs/operator/delay';
import 'rxjs/operator/mergeMap';
import 'rxjs/operator/switchMap';


import {bootstrap}    from "angular2/platform/browser";
import {HTTP_PROVIDERS} from 'angular2/http';
import {ROUTER_PROVIDERS, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {UserService} from "./services/UserService";
import {AppComponent} from "./routes";


bootstrap(AppComponent, [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    UserService
]).catch(err => console.error(err));
