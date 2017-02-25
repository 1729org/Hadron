import { Component } from '@angular/core';
import { Board } from '../models/board';
import { BoardService } from '../board-zone/board/board.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication-zone/app-authentication/authentication.service';
import * as Quill from 'quill';

const Parchment = Quill.import('parchment');
let Block = Parchment.query('block');

Block.tagName = 'DIV';
Quill.register(Block, true);

@Component({
  selector: 'board-zone',
  templateUrl: './board-zone.component.html',
})
export class BoardZoneComponent {
   private boardName :string;

   constructor(private boardService :BoardService, 
     private authenticationService :AuthenticationService,
     private router: Router) {
     if(!authenticationService.isAuthenticated()) {
       this.router.navigateByUrl('/login');
     }
     
     this.boardName = boardService.getCurrentBoardName();
     console.log(this.boardName);
   }

}