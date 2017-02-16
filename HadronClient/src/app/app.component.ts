import { Component } from '@angular/core';
import { Board } from './models/board';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
   private board :Board;

   constructor() {
   		this.board = null;
   }

   onBoard(board :Board) {
      this.board = board;
   }
}
