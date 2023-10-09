import { AfterViewInit, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import *  as XLSX from 'xlsx';
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import { MatDialog } from '@angular/material/dialog';
import { NewDialogComponent } from './new-dialog/new-dialog.component';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { ConfirmDeleteDialogComponent } from './confirm-delete-dialog/confirm-delete-dialog.component';





@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit,AfterViewInit,OnChanges {

X
len
 ismap=false
 AllData=[];
 heads=[];
 exTable: any;
 filterParam: string = '';

 tab = document.createElement('div');
  table: Tabulator;


 constructor(public dialog: MatDialog) {
 }
  ngOnChanges(changes: SimpleChanges): void {
   
  }




 ngAfterViewInit() {
 
 }


 ngOnInit() {

 }

 
  upload(event){

const selectedFile = event.target.files[0];
const fileRdr=new FileReader()
fileRdr.readAsBinaryString(selectedFile)
fileRdr.onload = (e) =>{

  let binary =e.target.result
  let  workbook =XLSX.read( binary,{type:'binary'})

  workbook.SheetNames.forEach(x=>{
    this.AllData = XLSX.utils.sheet_to_json(workbook.Sheets[x]);
    console.log(this.AllData);
    
  // this.AllData=this.AllData.map(x=> ( {
  //   id: x.id, 
  //     len: x.len,
  //      wkt: x.wkt,
  //       status: x.status
  //       }) )
  ;
  })
  let a=[...Object.keys(this.AllData[0])]
  a.forEach(x=>{
    this.heads.push( { title: x, field: x,headerFilter:"input",align:x=='id'?"center":x=='status'?"center":"" ,headerFilterPlaceholder:x=='id'?"":x=='status'?"":"search",width:x=='id'?"50":x=='status'?"70":"150" })
  })
  this.heads.push({formatter:this.crossIcon, width:10, align:"center", cellClick:(e, cell)=>this.delete(cell)})
  this.heads.push({formatter:this.editIcon, width:10, align:"center", cellClick:(e, cell)=>this.openDialog(cell.getRow().getData())})
  this.heads.push({formatter:this.printIcon, width:10, align:"center", cellClick:(e, cell)=>this.openMap(cell.getRow().getData())})
  //this.heads=[...Object.keys(this.AllData[0])]
  this.drawTable();
 
}

  }

  private drawTable(): void {

    
    
    this.table= new Tabulator(this.tab, {
    //  responsiveLayout:true,
      data: this.AllData.reverse(),
      reactiveData:false, 
      columns: this.heads,
      layout: 'fitData',
    addRowPos: "top",         
    history: true,         
    pagination: true,     
    paginationSize: 16,     
    movableColumns: true,     
    resizableRows: false,  
      
    });
    document.getElementById('my-tabular-table').appendChild(this.tab);
  }/////////
  

  openDialog(data): void {
    const dialogRef = this.dialog.open(NewDialogComponent, {
      data: data,
      width:'400px',
      restoreFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
     
     if (result) {
     if (result.id) {
      this.table.updateRow(result.id, {id:result.id,len:result.len,status:result.status});
      this.AllData=this.AllData.filter(x=>x.id!=result.id)
      this.AllData.unshift(result)
      console.log(this.AllData);
     }else{
      this.table.addRow({id:(this.AllData[0].id+1),len:result.len,status:result.status});
      this.AllData.unshift({id:(this.AllData[0].id+1),len:result.len,status:result.status})
      console.log(this.AllData);
      
     }
  

     
     }
   
    });
  }

  delete(cell){
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {restoreFocus: false});
    dialogRef.afterClosed().subscribe(dialogResult => { 
      if(dialogResult){
        cell.getRow().delete();
        this.AllData=this.AllData.filter(x=>x.id!=cell.getRow().getData().id)
        
      }
    });

  }
openMap(data){
 
  this.len=data.len
  let a =data.wkt.replace('LINESTRING(','').replace(')','').split(',')
  let x=a[0].split(' ')
  let y=a[1].split(' ')
  this.X=[[+x[0],+x[1]],[+y[0],+y[1]]]
  console.log(data.wkt);
  console.log(this.X);
  this.ismap=true;
}

 printIcon = function(cell, formatterParams){ //plain text value
  return "<i style='margin-left:10px' class='fa fa-map-pin black'></i>";
};

editIcon = function(cell, formatterParams){ //plain text value
  return "<i style='margin-left:10px' class='fa fa-pencil'></i>";
};

crossIcon = function(cell, formatterParams){ //plain text value
  return "<i style='margin-left:10px;color: #d10000;' class='fa fa-trash'></i>";
};
/////////////////////////////////////

  // Pie
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
  };
  public pieChartLabels = [  'Status 0' ,  'Status 1' , 'Status 2' ];
  public pieChartDatasets
  public pieChartLegend = true;
  public pieChartPlugins = [];
  ///////////////////////
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartConfiguration<'bar'>['data'] 

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: false,
  };


  setAlaliz2(){
    this.barChartData=
    {
      labels: [ 'Status 0','Status 1','Status 2' ],
      datasets: [
        { data: [ 
          this.AllData.filter(x=>x.status==0).length,
          this.AllData.filter(x=>x.status==1).length,
          this.AllData.filter(x=>x.status==2).length,
        ], label: 'Status' },
    
      ]
    };

    
  }

  setAlaliz(){
     this.pieChartDatasets = [ {
      data: [ 
        this.AllData.filter(x=>x.status==0).length,
        this.AllData.filter(x=>x.status==1).length,
        this.AllData.filter(x=>x.status==2).length,
      ]
    } ];

    
  }

}
