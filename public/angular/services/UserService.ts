import {Http} from 'angular2/http';
import {Inject} from 'angular2/core';

import {DBService} from './service';

export class UserService extends DBService {

    http: Http;
    model : string = 'users';

    constructor(@Inject(Http) http) {
        super(http);
        super.model = this.model;
    }
}
