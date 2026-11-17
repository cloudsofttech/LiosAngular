import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Dialog } from 'primeng/dialog';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data/data.service';
import { FormService } from 'src/app/services/form-service/form.service';

@Component({
  selector: 'app-crane-details',
  templateUrl: './crane-details.component.html',
  styleUrls: ['./crane-details.component.scss'],
})
export class CraneDetailsComponent implements OnInit {
  objectSubscriber$: Subscription;
  @Input() formName: any;

  crane: any;
  clonedRow: any;

  weightDropdown: any = [
    { label: '20" Container', value: 20 },
    { label: '30" Container', value: 30 },
    { label: '40" Container', value: 40 },
    { label: '40" Ultra Container', value: 50 },
  ];

  startDate: any;
  endDate: any;
  today = new Date();

  constructor(
    private dataService: DataService,
    private formService: FormService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private dialogRef: Dialog
  ) {
    this.dialogRef.onShow.subscribe(() => {
      if (this.formService.checkForm('craneDetailsForm')) {
        this.loadSubscriptions();
      }
    });
    this.dialogRef.onHide.subscribe(() => {
      if (this.formService.checkForm('craneDetailsForm')) {
        this.destroySubscription();
      }
    });
  }

  ngOnInit() {}

  loadSubscriptions() {
    this.objectSubscriber$ = this.formService
      .getFormObject()
      .subscribe((value) => {
        this.crane = { ...value };
        console.log(this.crane);
        for (let inq of this.crane.inquiry || []) {
          for (let transaction of inq.transactions || []) {
            if (transaction.start?.length > 10) {
              transaction.start = new Date(
                String(this.reverseString(transaction?.start.slice(0, -9)))
              );
            }
            if (transaction.end?.length > 10) {
              transaction.end = new Date(
                String(this.reverseString(transaction?.end.slice(0, -9)))
              );
            }
            transaction.transactionDetails = (
              transaction.transactionDetails || []
            ).map((detail) => ({
              ...detail,
              start: this.toDate(detail.start),
              end: this.toDate(detail.end),
            }));
          }
        }
      });
  }

  destroySubscription() {
    this.objectSubscriber$.unsubscribe();
  }

  onRowEditInit(row: any) {
    this.clonedRow = {
      ...row,
      transactionDetails: (row.transactionDetails || []).map((detail) => ({
        ...detail,
        start: this.toDate(detail.start),
        end: this.toDate(detail.end),
      })),
    };
  }

  addTransactionDetail(transaction: any) {
    transaction.transactionDetails = transaction.transactionDetails || [];
    transaction.transactionDetails.push({
      id: 0,
      start: new Date(),
      end: new Date(),
    });
  }

  private toDate(value: Date | string): Date {
    return value instanceof Date ? value : new Date(value);
  }

  private toLocalDateTimeString(value: Date | string): string {
    const date = this.toDate(value);
    const pad = (part: number, length = 2) => String(part).padStart(length, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
      date.getSeconds()
    )}.${pad(date.getMilliseconds(), 3)}`;
  }

  onRowEditSave(row: any) {
    if (this.formName === 'craneDetailsForm') {
      let obj = {
        id: this.clonedRow.id,
        weight: row.weight,
        quantity: row.quantity,
        start: this.toLocalDateTimeString(row.start),
        end: this.toLocalDateTimeString(row.end),
      };
      if (this.showTransactionDetails(row.serviceName)) {
        obj['transactionDetails'] = (row.transactionDetails || []).map(
          (detail) => ({
            id: detail.id || 0,
            start: this.toLocalDateTimeString(detail.start),
            end: this.toLocalDateTimeString(detail.end),
          })
        );
      }

      this.dataService.updateCrane2(obj).subscribe(
        (resp) => {
          this.formService.triggerRefresh();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Başarıyla güncellendi',
          });
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
  }

  onRowEditCancel(row: any, index: number, i: number) {
    this.crane.inquiry[i].transactions[index] = {
      ...this.clonedRow,
      transactionDetails: (this.clonedRow.transactionDetails || []).map(
        (detail) => ({ ...detail })
      ),
    };

    // this.products2[index] = this.clonedProducts[product.id];
    // delete this.clonedProducts[product.id];
  }

  deleteRow(row: any, index: number, i: number) {
    if (this.formName === 'craneDetailsForm') {
      let obj = {
        id: this.clonedRow.id,
        weight: row.weight,
        quantity: row.quantity,
        start: this.toLocalDateTimeString(row.start),
        end: this.toLocalDateTimeString(row.end),
        isDeleted: true,
      };

      this.dataService.updateCrane2(obj).subscribe(
        (resp) => {
          this.messageService.add({
            severity: 'info',
            summary: 'Info',
            detail: 'Başarıyla silindi',
          });

          this.crane.inquiry[i].transactions.splice(index, 1);
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
  }

  displayInterest(interest){
    return interest && interest > 0 ? ` [${interest}]` : ''
  }

  displayHeaderData(inquiry){
    /*return {{ 'Group' | translate }} {{ inq.group }} - [{{ inq.id }}]  (${{
      inq.amount
    }})*/
  }

  ////// field Conditions

  quantityFieldCondition(field) {
    if (
      field === 'A (BULK LOAD)' ||
      field === 'A (IRON LOAD)' ||
      field === 'B (WEIGHT)' ||
      field === 'C.1 (WEIGHT)' ||
      field === 'D.1 (WEIGHT)' ||
      // ||this.currentService === 'G (PHÖNOMATİK)'
      field === 'E.1 (FULL CONTAINER)' ||
      field === 'E.2 (EMPTY CONTAINER)' ||
      field === 'C.2.A (FULL CONTAINER)' ||
      field === 'C.2.B (EMPTY CONTAINER)'
    ) {
      return true;
    }
    return false;
  }

  weightTonnagePlaceholderCondition(field) {
    if (field === 'G (PHÖNOMATİK)') {
      return true;
    }
    return false;
  }

  weightFieldCondition(field) {
    if (
      field === 'B (WEIGHT)' ||
      field === 'C.1 (WEIGHT)' ||
      field === 'D.1 (WEIGHT)'
    ) {
      return true;
    }
    return false;
  }

  quantityPlaceholderCondition(field): string {
    if (
      field === 'B (WEIGHT)' ||
      field === 'D.1 (WEIGHT)' ||
      field === 'C.1 (WEIGHT)' ||
      field === 'C.2.A (FULL CONTAINER)' ||
      field === 'C.2.B (EMPTY CONTAINER)'
    ) {
      return 'Lift';
    }

    if (field === 'A (BULK LOAD)' || field === 'A (IRON LOAD)') {
      return 'Tonnage';
    }

    if (field === 'E.1 (FULL CONTAINER)' || field === 'E.2 (EMPTY CONTAINER)') {
      return 'Number of Containers';
    }
    return 'Miktar';
  }

  dropdownConition(field) {
    if (
      field === 'E.1 (FULL CONTAINER)' ||
      field === 'E.2 (EMPTY CONTAINER)' ||
      field === 'C.2.A (FULL CONTAINER)' ||
      field === 'C.2.B (EMPTY CONTAINER)'
    ) {
      return true;
    }
    return false;
  }

  ultraConition(field) {
    if (field === 'E.1 (FULL CONTAINER)' || field === 'E.2 (EMPTY CONTAINER)') {
      return true;
    }
    return false;
  }

  showDateForCrane(field) {
    if (
      field === 'A (BULK LOAD)' ||
      field === 'A (IRON LOAD)' ||
      field === 'B (WEIGHT)' ||
      field === 'C.1 (WEIGHT)' ||
      field === 'C.2.A (FULL CONTAINER)' ||
      field === 'C.2.B (EMPTY CONTAINER)' ||
      field === 'D.1 (WEIGHT)' ||
      field === 'E.1 (FULL CONTAINER)' ||
      field === 'E.2 (EMPTY CONTAINER)' ||
      field === 'G (PHÖNOMATİK)'
    ) {
      return false;
    }
    return true;
  }

  showTransactionDetails(serviceName: string): boolean {
    const normalizedServiceName =
      typeof serviceName === 'string' ? serviceName.trim() : '';
    return (
      normalizedServiceName.startsWith('A') ||
      normalizedServiceName.startsWith('D.2')
    );
  }

  reverseString(str) {
    let splitString = str.split(/([/])/);
    let reverseArray = splitString.reverse();
    let joinArray = reverseArray.join('');
    return joinArray;
  }

  reportVar1;
  reportVar2;
  reportIsAlternative;
  displayTelerikDialog;
  telerik;
  showTelerikReport(var1 = '', var2 = '', isAlternative = false) {
    this.reportVar1 = var1;
    this.reportVar2 = var2;

    if (isAlternative) {
      this.reportIsAlternative = 'true';
    } else {
      this.reportIsAlternative = 'false';
    }

    this.displayTelerikDialog = true;
    this.telerik = true;
  }
}
