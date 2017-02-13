import { Injectable } from '@angular/core';
import { AuthenticationConstants } from './authentication.constants';
import { GenericConstants } from '../generics/generics.constants';
import { Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HadronHttp } from '../generics/generics.interceptor';
import { Tools } from '../generics/generics.tools';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {

	constructor(private hadronHttp: HadronHttp) {
	}

	public authenticate(email) :Observable<any> {
		let authHeader = new Headers();
		    authHeader.append('Authorization', btoa(email));
		return this.hadronHttp
        .get(`${GenericConstants.BASE_URL}${AuthenticationConstants.LOGIN_URL}`, {
        	headers: authHeader
        })
        .map((response :Response) => {
        	let body = response.json();
			return body.data || { };
        })
        .map(Tools.mapToBoard)
        .catch((error :Response | any) => {
        	console.log(error.status);
			return Observable.throw(error);
        });
	}

    public isAuthenticated() {
        return localStorage.getItem('x-auth-token') != null;
    }
}