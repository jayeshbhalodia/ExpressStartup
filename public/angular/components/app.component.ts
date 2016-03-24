import {Component} from 'angular2/core';
import {ROUTER_PROVIDERS, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {AboutUs, Home} from "./home";


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


// @Component({
//   selector: 'my-app',
//   template: `
//     <h1>Component Router</h1>
//     <nav>
//       <a [routerLink]="['CrisisCenter']">Crisis Center</a>
//       <a [routerLink]="['Heroes']">Heroes</a>
//     </nav>
//     <router-outlet></router-outlet>
//   `,
//   directives: [ROUTER_DIRECTIVES]
// })
