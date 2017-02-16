import { Component } from '@angular/core';
import { Board } from './models/board';
import { BoardService } from './board/board.service';
import { AuthenticationService } from './app-authentication/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ BoardService, AuthenticationService ]
})
export class AppComponent {

   constructor(private boardService :BoardService, 
     private authenticationService :AuthenticationService) {
   }

   shouldCreateNewBoard() :boolean{
     return this.boardService.hasBoard();
   }

   isAuthenticated() :boolean{
     return this.authenticationService.isAuthenticated();
   }

   onBoard(board :Board) {
     // this.board = board;
   }
}
