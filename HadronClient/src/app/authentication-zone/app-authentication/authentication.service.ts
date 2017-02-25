import { Injectable } from '@angular/core';
import { AuthenticationConstants } from './authentication.constants';
import { GenericConstants } from '../../generics/generics.constants';
import { Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HadronHttp } from '../../generics/generics.interceptor';
import { Board } from '../../models/board';
import { Tools } from '../../generics/generics.tools';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {

	constructor(private hadronHttp: HadronHttp) {
	}

	authenticate(email) :Observable<any> {
		let authHeader = new Headers();
		    authHeader.append('Authorization', btoa(email));
		return this.hadronHttp
        .get(`${GenericConstants.BASE_URL}${AuthenticationConstants.LOGIN_URL}`, {
        	headers: authHeader
        })
        .map((response :Response) => {
            let toReturn :any = [response.headers.get('x-auth-token') != null];
        	let board :Board = Tools.mapToBoard(response.json().data);
            toReturn.push(board);
			return toReturn;
        })
        .catch((error :Response | any) => {
        	error.authentication = [error.headers.get('x-auth-token') != null];
			return Observable.throw(error);
        });
	}

    isAuthenticated() {
        return localStorage.getItem('token') != null;
    }

    getClaims() {

    }
}