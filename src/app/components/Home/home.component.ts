import {
  Component,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  Logger
} from '../../services/logger/logger.service';
import {
  Observable
} from 'rxjs/Observable';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';

import {
  setTimeout
} from 'timers';

const log = new Logger('Home');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})


export class HomeComponent implements OnInit {

  public logMessages: any;

  constructor(
      private router: Router
    ) {
     

  }

  ngOnInit() {
     
  }

}
