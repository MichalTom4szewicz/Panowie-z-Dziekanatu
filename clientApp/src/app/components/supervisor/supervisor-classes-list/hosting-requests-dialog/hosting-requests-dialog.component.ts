import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Classes } from 'src/app/domain/classes';
import { HostingRequest } from 'src/app/domain/hosting-request';
import { HostingRequestService } from 'src/app/services/hosting-request/hosting-request.service';

@Component({
  selector: 'pzd-hosting-requests-dialog',
  templateUrl: './hosting-requests-dialog.component.html',
  styleUrls: ['./hosting-requests-dialog.component.sass']
})
export class HostingRequestsDialogComponent implements OnInit {

  requstList: [HostingRequest, boolean, boolean][] = [];

  constructor(
    public dialogRef: MatDialogRef<HostingRequestsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public classes: Classes,
    private hostingRequestService: HostingRequestService
    ) { }

  ngOnInit(): void {
    this.hostingRequestService.getAllPendingHostingRequests(this.classes).subscribe(values =>
      this.requstList = values.map(element => [element, true, true])
    );
  }

  public isListEmpty(): boolean {
    return this.requstList.length === 0;
  }

  public mouseover(element: [HostingRequest, boolean, boolean], field: number): void {
    element[field] = false;
  }

  public mouseleave(element: [HostingRequest, boolean, boolean], field: number): void {
    element[field] = true;
  }

  public accept(hostingRequest: HostingRequest): void {
    this.hostingRequestService.rejectHostingRequests(
      this.requstList
        .filter(element => element[0].id !== hostingRequest.id)
        .map(element => element[0])
    );
    this.hostingRequestService.acceptHostingRequest(hostingRequest);
    this.dialogRef.close(hostingRequest.user);
  }

  public reject(hostingRequest: HostingRequest): void {
    this.hostingRequestService.rejectHostingRequest(hostingRequest).subscribe(() =>
      this.requstList = this.requstList.filter(element => element[0].id !== hostingRequest.id)
    );
  }

  public doNothing(): void {
    this.dialogRef.close(undefined);
  }
}
