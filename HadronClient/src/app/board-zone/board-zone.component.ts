import { Component, NgZone } from '@angular/core';
import { Board } from '../models/board';
import { BoardService } from '../board-zone/board/board.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication-zone/app-authentication/authentication.service';
import { MdDialog } from '@angular/material';
import { BoardListDialogComponent } from './board-list-dialog/board-list-dialog.component';
import { BoardNewDialogComponent } from './board-new-dialog/board-new-dialog.component';
import { TextDocumentNewDialogComponent } from './text-document-new-dialog/text-document-new-dialog.component';
import { BoardConstants } from '../board-zone/board/board.constants';
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
   private textDocumentName :string;
   private newBoardName :string;
   private newTextDocumentName :string;
   private showChangeBoardNameInput :boolean;
   private showChangeTextDocumentNameInput :boolean;
   private boardNameTimeoutId :any;
   private textDocumentNameTimeoutId :any;
   private quillEditor :any;
   private quillModules :any = BoardConstants.QUILL_MODULES;
   
   constructor(private boardService :BoardService, 
     private authenticationService :AuthenticationService,
     private zone: NgZone,
     private dialog: MdDialog,
     private router: Router,) {
     boardService.logout$.subscribe(logout => {
       if(logout) {
         this.clearAndLogout();
       }
     });
     if(!authenticationService.isAuthenticated()) {
       this.router.navigateByUrl('/login');
     }
     if(!boardService.hasBoard()) {
       boardService.getLastModifiedBoard().subscribe(data => {
         this.zone.run(() => {
           this.boardName = boardService.getCurrentBoardName();
           this.textDocumentName = boardService.getCurrentTextDocumentName();
         });
       }, error => {});
     } else {
       this.boardName = boardService.getCurrentBoardName();
       this.textDocumentName = boardService.getCurrentTextDocumentName();
     }
     this.showChangeBoardNameInput = false;
     this.showChangeTextDocumentNameInput = false;
   }

   setQuillEditor(event) {
     this.quillEditor = event;
     this.quillEditor.on('text-change', (a,b,c,d) => {
       console.log(a,b,c,d);
     });
   }

   changeBoard() {
     this.dialog.closeAll();
     this.dialog
     .open(BoardListDialogComponent, {width: "55vw"})
     .afterClosed().subscribe(result => {
          if(result && result.name !== this.boardName) {
            this.boardService
            .getBoard(result.ownerEmail, result.name)
            .subscribe(data => {
              this.zone.run(() => {
               this.boardName = this.boardService.getCurrentBoardName();
               this.textDocumentName = this.boardService.getCurrentTextDocumentName();
              });
            }, error => {});
          }
          console.log(result);
     });
   }

   newBoard() {
     this.dialog.closeAll();
     this.dialog
     .open(BoardNewDialogComponent)
     .afterClosed().subscribe(result => {
       if(result) {
         this.boardService
         .createBoard(result)
         .subscribe(data => {
           this.zone.run(() => {
             this.boardName = this.boardService.getCurrentBoardName();
             this.textDocumentName = this.boardService.getCurrentTextDocumentName();
           });
         }, error => {});
       }
     });
   }

   newTextDocument() {
     this.dialog.closeAll();
     this.dialog
     .open(TextDocumentNewDialogComponent)
     .afterClosed().subscribe(result => {
       if(result) {
         this.boardService
         .createTextDocument(result)
         .subscribe(data => {
           this.zone.run(() => {
             this.textDocumentName = this.boardService.getCurrentTextDocumentName();
           });
         }, error => {});
       }
     });
   }

   changeTextDocument() {
     console.log('change-text-document');
   }

   showChangeBoardName() {
     if(!this.boardService.isOwner()) {
       return;
     }
     this.zone.run(() => {
       this.newBoardName = this.boardName;
       this.showChangeBoardNameInput = true;
       this.boardNameTimeoutId = setTimeout(() => { this.showChangeBoardNameInput = false}, 2000);
     });
   }

   showChangeTextDocumentName() {
     this.zone.run(() => {
       this.newTextDocumentName = this.textDocumentName;
       this.showChangeTextDocumentNameInput = true;
       this.textDocumentNameTimeoutId = setTimeout(() => { this.showChangeTextDocumentNameInput = false}, 2000);
     });
   }

   focusedBoardNameInput() {
     clearTimeout(this.boardNameTimeoutId);
   }

   focusedTextDocumentNameInput() {
     clearTimeout(this.textDocumentNameTimeoutId);
   }

   changeBoardName() {
     if(this.newBoardName !== this.boardName) {
       this.boardService
       .changeBoardName(this.newBoardName)
       .subscribe(data => {
           this.boardName = this.newBoardName;
       }, error => {});
     }
     this.showChangeBoardNameInput = false;
   }

   changeTextDocumentName() {
     if(this.newTextDocumentName !== this.textDocumentName) {
       this.boardService
       .changeTextDocumentName(this.newTextDocumentName)
       .subscribe(data => {
           this.textDocumentName = this.newTextDocumentName;
       }, error => {});
     }
     this.showChangeTextDocumentNameInput = false;
   }

   hideBoardNameInput() {
     console.log('lost');
     this.showChangeBoardNameInput = false;
   }

   hideTextDocumentNameInput() {
     console.log('lost');
     this.showChangeTextDocumentNameInput = false;
   }

   clearAndLogout() {
     console.log('here');
     this.dialog.closeAll();
     this.boardService.clearAndLogout();
     this.router.navigateByUrl('/login');
   }

}