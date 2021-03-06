import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({selector: 'app-header', templateUrl: './header.component.html'})
export class HeaderComponent implements OnInit {

    searchInput : string = '';

    @Output()createNoteEvent = new EventEmitter < null > ();
    @Output()deleteNoteEvent = new EventEmitter < null > ();
    @Output()searchEvent = new EventEmitter < string > ();
    @Output()stopSearchEvent = new EventEmitter < null > ();
    @Output()toggleSideBarEvent = new EventEmitter < null > ();

    @Input()newNoteOpened : boolean;
    @Input()filtering : boolean;
    @Input()showSideBar : boolean;
    constructor() {}

    ngOnInit() {}

    searchNotes() {
        if (this.searchInput.trim().length > 0) {
            this
                .searchEvent
                .emit(this.searchInput);
        } else {
            this.stopSearchNotes();
        }

    }
    toggleSideBar() {
        this
            .toggleSideBarEvent
            .emit(null);
    }

    stopSearchNotes() {
        this.searchInput = '';
        this
            .stopSearchEvent
            .emit(null);
    }

    deleteNote() {
        this
            .deleteNoteEvent
            .emit(null);
    }
    createNote() {
        if (!this.newNoteOpened) {

            if (this.filtering) {
                this.stopSearchNotes();
            }
            this
                .createNoteEvent
                .emit(null);
        }
    }

}
