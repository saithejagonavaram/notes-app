import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent }  from './app.component';
import { HeaderComponent } from './components/Header/header.component';
import { HomeComponent } from './components/Home/home.component';



@NgModule({
  imports:      [ 
    BrowserModule, 
    AppRoutingModule 
],
  declarations: [ AppComponent, HeaderComponent, HomeComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { 

  constructor(){
  }
}
