import { Component, EventEmitter, Output } from '@angular/core';
import { FacebookService } from './facebook.service';
import { AuthenticationService} from '../app-authentication/authentication.service';
import { Board } from '../models/board';

@Component({
  selector: 'facebook-login',
  templateUrl: './facebook.component.html',
  styleUrls: ['./facebook.component.css'],
  providers: [ FacebookService, AuthenticationService ]
})
export class FacebookComponent {
	@Output() 
	private onBoard = new EventEmitter<Board>();
	constructor(private facebookService :FacebookService) {
		facebookService.board$.subscribe(board => {
			this.onBoard.emit(board);
	    });
	}

	onFacebookLoginClick() {
		this.facebookService
		.login();
    };
}
