import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Classes } from 'src/app/domain/classes';
import { HostingRequest } from 'src/app/domain/hosting-request';
import { HostingRequestService } from 'src/app/services/hosting-request/hosting-request.service';
import { UserUtils } from 'src/app/utils/user-utils';

@Component({
  selector: 'pzd-hosting-requests-dialog',
  templateUrl: './hosting-requests-dialog.component.html',
  styleUrls: ['./hosting-requests-dialog.component.sass']
})
export class HostingRequestsDialogComponent implements OnInit {

  requstList: HostingRequestDisplay[] = [];

  constructor(
    public dialogRef: MatDialogRef<HostingRequestsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public classes: Classes,
    private hostingRequestService: HostingRequestService
    ) { }

  ngOnInit(): void {
    this.hostingRequestService.getAllPendingHostingRequests(this.classes).subscribe(values =>
      this.requstList = values.map(element => this.getHostingRequestDisplay(element))
    );
  }

  public isListEmpty(): boolean {
    return this.requstList.length === 0;
  }

  public displayUser(hostingRequest: HostingRequest): string {
    return UserUtils.displayUser(hostingRequest.user);
  }

  public mouseover(element: HostingRequestDisplay, accept: boolean): void {
    if (accept) {
      element.mouseoverAccept = true;
    } else {
      element.mouseoverReject = true;
    }
  }

  public mouseleave(element: HostingRequestDisplay, accept: boolean): void {
    if (accept) {
      element.mouseoverAccept = false;
    } else {
      element.mouseoverReject = false;
    }
  }

  public accept(hostingRequest: HostingRequest): void {
    this.hostingRequestService.rejectHostingRequests(
      this.requstList
        .filter(element => element.hostingRequest.id !== hostingRequest.id)
        .map(element => element.hostingRequest)
    ).subscribe();
    this.hostingRequestService.acceptHostingRequest(hostingRequest).subscribe();
    this.dialogRef.close(hostingRequest.user);
  }

  public reject(hostingRequest: HostingRequest): void {
    this.hostingRequestService.rejectHostingRequest(hostingRequest).subscribe(() =>
      this.requstList = this.requstList.filter(element => element.hostingRequest.id !== hostingRequest.id)
    );
  }

  public doNothing(): void {
    this.dialogRef.close(undefined);
  }

  private getHostingRequestDisplay(hostingRequest: HostingRequest): HostingRequestDisplay {
    return {
      hostingRequest: hostingRequest,
      mouseoverAccept: false,
      mouseoverReject: false
    }
  }
}

interface HostingRequestDisplay {
  hostingRequest: HostingRequest,
  mouseoverAccept: boolean,
  mouseoverReject: boolean
}
