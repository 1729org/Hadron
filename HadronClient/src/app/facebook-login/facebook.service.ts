import { OnInit } from '@angular/core';
import { Injectable } from "@angular/core";
import { FacebookConstants } from './facebook.constants';
import { GenericConstants } from '../generics/generics.constants';
import { AuthenticationService } from '../app-authentication/authentication.service';
import { Subject } from 'rxjs/Subject';
import { Board } from '../models/board';

declare const FB:any;

@Injectable()
export class FacebookService implements OnInit {
    private board = new Subject<Board>();

    board$ = this.board.asObservable();

	constructor(private authenticationService :AuthenticationService) {
		FB.init(FacebookConstants.FACEBOOK_CONFIGURATION);
        console.log(this.authenticationService);
	}

	login() {
        FB.login(result => { 
            FB.api(FacebookConstants.FACEBOOK_API_URL, userInfo => { 
                 return this.authenticationService
                .authenticate(userInfo.email)
                .subscribe(data => {
                        this.board.next(data);
                   },
                   error => {
                      if(error.status === 401) {
                        this.board.next(null);
                   }
                }); 
            }); 
        }, FacebookConstants.FACEBOOK_SCOPE);
    }

    statusChangeCallback(response) {
        console.log(response);
    }

    ngOnInit() {
        FB.getLoginStatus(response => {
            this.statusChangeCallback(response);
        });
    }
}