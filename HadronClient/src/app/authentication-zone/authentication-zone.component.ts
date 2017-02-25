import { Component, NgZone } from '@angular/core';
import { Board } from '../models/board';
import { BoardService } from '../board-zone/board/board.service';
import { AuthenticationService } from './app-authentication/authentication.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { BoardDialogComponent } from './board-dialog/board-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'authentication-zone',
  templateUrl: './authentication-zone.component.html',
  styleUrls: ['./authentication-zone.component.css']
})
export class AuthenticationZoneComponent {
   private authenticated :boolean;

   constructor(private boardService :BoardService, 
     private authenticationService :AuthenticationService,
     private zone: NgZone,
     private dialog: MdDialog,
     private router: Router) {
     if(authenticationService.isAuthenticated()) {
       this.getBoard();
     }
   }

   onAuthentication(authentication :[boolean, Board]) {
     this.zone.run(() => {
       this.authenticated = authentication[0];
     });
     if(this.authenticated) {
       if(authentication.length === 1 || !authentication[1]) {
         this.dialog
         .open(BoardDialogComponent, {
           disableClose: true
         })
         .afterClosed().subscribe(result => {
          this.createBoard(result);
        });
       }
     }
   }

   createBoard(name) {
     this.boardService
     .createBoard(name)
     .subscribe(data => {
           console.log(this.boardService.hasBoard());
           this.router.navigateByUrl('/board');
         },
         error => {
      });
   }

   getBoard() {
      this.boardService
     .getLastModifiedBoard()
     .subscribe(data => {
         this.router.navigateByUrl('/board');
       },
       error => {
    });
   }
}