import {Component} from 'angular2/core';
import {ROUTER_PROVIDERS, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {AboutUs, Home} from "./components/home";


@Component({
    selector: 'start-engine',
    templateUrl: '/angular/views/layout.html',
    directives: [ROUTER_DIRECTIVES]
})

@RouteConfig([
  {path:'/', name: 'Home', component: Home},
  {path:'/about-us', name: 'AboutUS', component: AboutUs},
])

export class AppComponent {

}
