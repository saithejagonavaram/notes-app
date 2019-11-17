import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Note} from '../../models/note.model';
import {AfterViewInit} from '@angular/core/src/metadata/lifecycle_hooks';

const DEFAULT_NOTE_TITLE = 'New Note';
const DEFAULT_NOTE_BRIEF = 'No additonal text';

declare var moment : any;
declare var uuid : any;

@Component({selector: 'app-home', templateUrl: './home.component.html'})
export class HomeComponent implements OnInit,
AfterViewInit {

    @ViewChild('notetext')noteTextField : ElementRef;

    public logMessages : any;

    public momentForUI : any = moment;

    mainNotes : Note[] = [];
    notes : Note[] = [];
    filteredNotes : Note[] = [];
    filtering : boolean = false;
    selectedNote : Note;

    showSideBar = true;

    newNoteOpened : boolean = false;
    noteId : string = uuid.v4();
    newNoteData : Note = {
        id: uuid.v4(),
        title: DEFAULT_NOTE_TITLE,
        relativeTimeStamp: '',
        mainTimeStamp: '',
        brief: DEFAULT_NOTE_BRIEF,
        content: '',
        timeStamp: ''
    };
    defaultNoteData : Note = {
        id: uuid.v4(),
        title: DEFAULT_NOTE_TITLE,
        relativeTimeStamp: '',
        mainTimeStamp: '',
        brief: DEFAULT_NOTE_BRIEF,
        content: '',
        timeStamp: ''
    }

    constructor() {
        if (this.getLocalStorage() !== null) {
            this.mainNotes = this.getLocalStorage();
            this.notes = this.mainNotes;
        } else {
            this.setLocalStorage();
        }
        if (this.notes.length > 0) {
            this.selectedNote = this.notes[0];
        } else {

            this.selectedNote = this.newNoteData;

        }

        localStorage.setItem('user', 'testing');
        let time = new Date().toISOString();
    }

    ngOnInit() {
        if (this.notes.length === 0) {
            this.createNote();
        }
    }
    ngAfterViewInit() {
        this
            .noteTextField
            .nativeElement
            .focus();
    }

    setLocalStorage() {
        if (!this.filtering) {
            this.mainNotes = this.notes;
            localStorage.setItem('notes', JSON.stringify(this.mainNotes));
        } else {

            localStorage.setItem('notes', JSON.stringify(this.mainNotes));
        }
    }

    getLocalStorage() {
        return JSON.parse(localStorage.getItem('notes'));
    }

    removeCreatedNote() {
        let that = this;
        this.notes = this
            .notes
            .filter(function (note) {
                return note.id !== that.noteId;
            });
        this.setLocalStorage();
        this.newNoteOpened = false;
    }

    onSelect(note : Note) : void {

        if(note.id !== this.selectedNote.id) {

            if (this.newNoteOpened && this.newNoteData.content.length === 0) {

                this.removeCreatedNote();

            } else {
                this.newNoteOpened = false;
            }

            this.selectedNote = note;
            this
                .noteTextField
                .nativeElement
                .focus();
        }
    }

    getMainTimeStamp(timestamp : any) {
        return moment(timestamp).format('DD MMMM YYYY') + ' at ' + moment(timestamp).format('LT');
    }

    getRelativeTimeStamp(timestamp : any) {
        return moment().calendar(timestamp, {
            sameDay: 'LT',
            lastDay: '[Yesterday]',
            lastWeek: '[Last] dddd',
            sameElse: 'DD/MM/YYYY'
        });
    }
    getCurrentTimeStamp() {
        return moment(new Date()).valueOf();
    }

    updateEditedNoteTimeStamp() {
        this.selectedNote.timeStamp = this.getCurrentTimeStamp();
        this.selectedNote.mainTimeStamp = this.getMainTimeStamp(this.selectedNote.timeStamp);
        this.selectedNote.relativeTimeStamp = this.getRelativeTimeStamp(this.selectedNote.timeStamp);
    }

    createNote() {
        this.newNoteOpened = true;
        this.noteId = uuid.v4();
        let data = {
            id: this.noteId,
            title: DEFAULT_NOTE_TITLE,
            relativeTimeStamp: '',
            mainTimeStamp: '',
            brief: DEFAULT_NOTE_BRIEF,
            content: '',
            timeStamp: this.getCurrentTimeStamp()
        }

        data.mainTimeStamp = this.getMainTimeStamp(data.timeStamp);
        data.relativeTimeStamp = this.getRelativeTimeStamp(data.timeStamp);

        this.newNoteData = data;
        this
            .notes
            .unshift(this.newNoteData);
        this.selectedNote = this.newNoteData;
        this.setLocalStorage();

        this
            .noteTextField
            .nativeElement
            .focus();

    }

    deleteNote() {
        let that = this;
        this.notes = this
            .notes
            .filter(function (note) {
                return note.id !== that.selectedNote.id;
            })

        if (this.filtering) {
            this.mainNotes = this
                .mainNotes
                .filter(function (note) {
                    return note.id !== that.selectedNote.id;
                })
        }

        this.setLocalStorage();

        if (this.newNoteOpened) {
            this.newNoteOpened = false;
        }

        if (this.notes.length > 0) {
            this.selectedNote = this.notes[0];
        } else {
            this.selectedNote = this.newNoteData;
        }

    }

    getTitleAndBrief(lineBreakSplit : any) {
        let that = this;
        let getTitle = true;
        let getBrief = false;
        lineBreakSplit.forEach(function (line : any) {

            let testLine = line.trim();
            if (testLine.length > 0 && getTitle) {
                that.selectedNote.title = line;
                getTitle = false;
                getBrief = true;
                return;
            }

            if (line.length > 0 && getBrief) {
                that.selectedNote.brief = line;
                getBrief = false;
            }

        })

        if (getTitle && !getBrief) {
            this.selectedNote.title = DEFAULT_NOTE_TITLE;
            this.selectedNote.brief = DEFAULT_NOTE_BRIEF;
        }
        if (!getTitle && getBrief) {
            this.selectedNote.brief = DEFAULT_NOTE_BRIEF;
        }

        this.setLocalStorage();
    }

    noteContentChanged(selectedNote : Note) {

        if (this.newNoteOpened && this.newNoteData.content.length > 0) {
            this.newNoteOpened = false;
        }

        var firstLineBreakIndex = this
            .selectedNote
            .content
            .indexOf("\n");

        var lineBreakSplit = this
            .selectedNote
            .content
            .split("\n");
        this.updateEditedNoteTimeStamp();
        this.sortNotes();
        this.getTitleAndBrief(lineBreakSplit);
    }

    sortNotes() {
        this
            .notes
            .sort(function (x : any, y : any) {
                return y.timeStamp - x.timeStamp;
            });
        if (!this.filtering) {
            this.mainNotes = this.notes;
        }
    }

    searchNotes(text : any) {
        if(this.notes.length > 0){
            if (!this.filtering) {
                this.mainNotes = this.notes;

            }

            this.filteredNotes=this.mainNotes
                                    .filter(function (note) {
                                        return note
                                            .content
                                            .indexOf(text) >= 0;
                                    });

            if (this.filteredNotes.length > 0) {
                this.notes = this.filteredNotes;
                this.selectedNote = this.notes[0];
                this.filtering = true;
            }
        }
    }

    stopSearchNotes() {
            if(this.filtering){
                this.filteredNotes = [];
                this.notes = this.mainNotes;
                this.selectedNote = this.notes[0];

                this.filtering = false;
            }
    }

    toggleSideBar() {
        this.showSideBar = !this.showSideBar;
    }

}
