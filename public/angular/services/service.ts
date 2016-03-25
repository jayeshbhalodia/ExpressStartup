import {Http,Headers, HTTP_PROVIDERS} from 'angular2/http';
import 'rxjs/operator/map';

export class DBService {

    public baseURL: string = 'http://localhost:3000/api';
    public model : string = '';
    public http : Http;

    constructor(http : Http) {
        this.http = http;
    }


    public insert(data: any) {
        var headers = new Headers();
            headers.append('Content-Type', 'application/json');
            data.model = this.model;

        return this.http.post(this.baseURL + '/db/insert',
            JSON.stringify(data),
            { headers: headers }).map(res => res.json());
    }



    public find(data: any) {

        var inputData = {
            model : this.model,
            condition: data || {}
        };

        var headers = new Headers();
            headers.append('Content-Type', 'application/json');

        return this.http.post(this.baseURL + '/db/find-all', JSON.stringify(inputData), { headers: headers }).map(res => res.json());
    }

    /**
     * Fetch Single Record
     * @param key _id of record
     */
    public findOne(key: string) {

        var inputData = {
            model : this.model,
            _id : key
        };

        var headers = new Headers();
            headers.append('Content-Type', 'application/json');

        return this.http.post(this.baseURL + '/db/find-one', JSON.stringify(inputData), { headers: headers }).map(res => res.json());
    }


    /**
     * Delete record base on _id
     */
    public delete(key: string) {

        var data = {
            model : this.model,
            _id :  key
        };

        var headers = new Headers();
            headers.append('Content-Type', 'application/json');

        return this.http.post(this.baseURL + '/db/delete', JSON.stringify(data), { headers: headers }).map(res => res.json());
    }

    /**
     *
     */
    public update(key: string, data: any) {
        // @todo write clean here
        if(!data) {
            data = {};
        }

        data.model = this.model;
        data._id = key || data._id;

        var headers = new Headers();
            headers.append('Content-Type', 'application/json');

        return this.http.post(this.baseURL + '/db/update', JSON.stringify(data), { headers: headers }).map(res => res.json());

    }
}
