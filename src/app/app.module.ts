import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatDialogModule} from '@angular/material/dialog';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { NewDialogComponent } from './new-dialog/new-dialog.component';
import { AngularOpenlayersModule } from 'ngx-openlayers';
import { ConfirmDeleteDialogComponent } from './confirm-delete-dialog/confirm-delete-dialog.component';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    NewDialogComponent,
ConfirmDeleteDialogComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    MatDialogModule,
    AngularOpenlayersModule,
    NgChartsModule,
   
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
