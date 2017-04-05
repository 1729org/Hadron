import { Component, NgZone, ViewChild, OnInit } from '@angular/core';
import { Board } from '../models/board';
import { RoomUsers } from '../models/room-users';
import { BoardService } from '../board-zone/board/board.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication-zone/app-authentication/authentication.service';
import { MdDialog } from '@angular/material';
import { BoardListDialogComponent } from './board-list-dialog/board-list-dialog.component';
import { BoardNewDialogComponent } from './board-new-dialog/board-new-dialog.component';
import { BoardCanvasDialogComponent } from './board-canvas-dialog/board-canvas-dialog.component';
import { TextDocumentNewDialogComponent } from './text-document-new-dialog/text-document-new-dialog.component';
import { BoardConstants } from '../board-zone/board/board.constants';
import { RoadMapDialogComponent } from './road-map-dialog/road-map-dialog.component';
import { TextDocumentListDialogComponent } from './text-document-list-dialog/text-document-list-dialog.component';
import { BoardShareDialogComponent } from './board-share-dialog/board-share-dialog.component';
import * as Quill from 'quill';

const Parchment = Quill.import('parchment');
let Block = Parchment.query('block');

Block.tagName = 'DIV';
Quill.register(Block, true);

@Component({
  selector: 'board-zone',
  templateUrl: './board-zone.component.html',
  styleUrls: ['./board-zone.component.css']
})
export class BoardZoneComponent {
   private boardName :string;
   private textDocumentName :string;
   private newBoardName :string;
   private roomUsers :RoomUsers;
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
     boardService.updateRoomUsers$.subscribe(roomUsers => {
       console.log('room users triggered');
       this.zone.run(() => {
         this.roomUsers = roomUsers
       });
     });
     if(!authenticationService.isAuthenticated()) {
       console.log('navigating to login');
       this.router.navigateByUrl('/login');
     }

         console.log('bp0');
     if(!boardService.hasBoard()) {
       console.log('does not have board');
       boardService.getLastModifiedBoard().subscribe(data => {
         console.log('bp1', data);
         this.zone.run(() => {
           this.boardName = boardService.getCurrentBoardName();
            console.log('here');
           this.textDocumentName = boardService.getCurrentTextDocumentName();
         });
       }, error => {});
     } else {
       this.boardName = boardService.getCurrentBoardName();
       this.textDocumentName = boardService.getCurrentTextDocumentName();
     }
     this.roomUsers = new RoomUsers();
     this.showChangeBoardNameInput = false;
     this.showChangeTextDocumentNameInput = false;
   }
   
  whiteBoardOpen() {
    this.boardService.unfocusQuillEditor();
     this.dialog.closeAll();
     this.dialog
     .open(BoardCanvasDialogComponent, {width: '100vw', height: '100vh', disableClose: true});
  }

   setQuillEditor(event) {
     this.boardService.setQuillEditor(event);
   }

   shareBoard() {
     if(this.boardService.isOwner()) {
       this.boardService.unfocusQuillEditor();
       this.dialog.closeAll();
       this.boardService
       .getMembers()
       .subscribe(data => {
         console.log(data.userIds);
          this.dialog
         .open(BoardShareDialogComponent, {width: "55vw", data: data.userIds})
         .afterClosed().subscribe(result => {
                if(result && result.length !== 0) {
                  console.log(data.userIds, result);
                  if(data.userIds.indexOf(result) < 0 && data.userIds.indexOf(this.boardService.getOwnerEmail()) < 0) {
                    this.boardService
                    .shareBoard(result)
                    .subscribe(data =>{},error=>{});
                  }
                }
         });
       }, error => {});
       
     }
   }

   changeBoard() {
     this.boardService.unfocusQuillEditor();
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

   showRoadMap() {
     this.boardService.unfocusQuillEditor();
     this.dialog.closeAll();
     this.dialog
     .open(RoadMapDialogComponent, {width: "65vw"})
     .afterClosed().subscribe(result => {
          console.log(result);
     });
   }

   newBoard() {
     this.boardService.unfocusQuillEditor();
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
     this.boardService.unfocusQuillEditor();
     this.dialog.closeAll();
     this.dialog
     .open(TextDocumentNewDialogComponent)
     .afterClosed().subscribe(result => {
       if(result) {
         this.boardService
         .createTextDocument(result)
         .subscribe(data => {
           this.zone.run(() => {
             console.log(this.boardService.getCurrentTextDocumentName());
             this.textDocumentName = this.boardService.getCurrentTextDocumentName();
           });
         }, error => {});
       }
     });
   }

   changeTextDocument() {
     this.boardService.unfocusQuillEditor();
     this.dialog.closeAll();
     this.dialog
     .open(TextDocumentListDialogComponent, {width: "55vw"})
     .afterClosed().subscribe(result => {
          if(result && result.name !== this.boardName) {
            this.boardService
            .getTextDocument(result.ownerEmail, result.name)
            .subscribe(data => {
              this.zone.run(() => {
                console.log(this.boardService.getCurrentTextDocumentName());
               this.textDocumentName = this.boardService.getCurrentTextDocumentName();
              });
            }, error => {});
          }
          console.log(result);
     });
   }

   showChangeBoardName() {
     if(!this.boardService.isOwner() || this.boardService.isShared()) {
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
     if(this.newBoardName !== this.boardName &&
        !this.boardService.isShared()) {
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