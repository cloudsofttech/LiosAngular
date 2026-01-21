import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from 'src/app/services/data/data.service';
import { Subscription } from 'rxjs';
import { Paginator } from 'primeng/paginator';
import { fadeInOut } from 'src/app/animations/animation';

@Component({
  selector: 'app-kasa',
  templateUrl: './kasa.component.html',
  styleUrls: ['./kasa.component.scss'],
  animations: [fadeInOut()],
})
export class KasaComponent implements OnInit {
  isLoading: boolean = false;
  refreshSubscriber$: Subscription;

  pageSize = 50;
  pageNumber = 1;
  tableData: any[];
  @ViewChild('paginator') paginator: Paginator;

  selectedColumns: any[] = [];
  columns = [
    { value: 'id', name: 'Id' },
    { value: 'next', name: 'Next' },
    { value: 'date', name: 'Date' },
    { value: 'closing', name: 'Closing' },
    { value: 'isClose', name: 'Is Close' },
  ];

  constructor(
    public translate: TranslateService,
    private dataService: DataService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.selectedColumns = [...this.columns];
    this.getData();
  }


  selection() {}

  getData() {
    this.dataService.getAllKasa().subscribe(
      (response) => {
        this.tableData = response.kasaList;
        this.isLoading = false;
      },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Bir hata oluştu.',
        });
      }
    );
  }

  onAddOpenCloseClick() {
    this.isLoading = true;
    this.dataService.openNewKasa().subscribe(
      (response) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Close/Open added successfully.',
        });
        this.getData();
      },
      (error) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to add Close.',
        });
      }
    );
  }

}
