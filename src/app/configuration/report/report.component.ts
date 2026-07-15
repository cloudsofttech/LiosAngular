import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data/data.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent {
  dateRanges: any = [new Date(), new Date()];

  reportVar1: any;
  reportVar2: any;
  reportIsAlternative: any;
  displayTelerikDialog: boolean = false;

  constructor(private dataService: DataService, public translate: TranslateService,
  ) {}

  showTelerikReport(var1 = '', isAlternative = false) {
    let startDate = this.dateRanges[0]
      ? this.dataService.convertDateTimeToIso(this.dateRanges[0]).split('T')[0]
      : '';

    let endDate = this.dateRanges[1]
      ? this.dataService.convertDateTimeToIso(this.dateRanges[1]).split('T')[0]
      : '';

    let query = `?start=${startDate}&end=${endDate}`;

    this.reportVar1 = var1;
    this.reportVar2 = query;

    this.reportIsAlternative = isAlternative ? 'true' : 'false';

    this.displayTelerikDialog = true;
  }
}
