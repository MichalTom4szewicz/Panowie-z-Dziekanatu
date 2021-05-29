import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HostingRequest } from 'src/app/domain/hosting-request';
import { ClassesStatusEnum } from 'src/app/enums/classes-status-enum';
import { Status } from 'src/app/enums/status';
import { Typ } from 'src/app/enums/typ';
import { ClassesWithStatus } from 'src/app/helpers/classes-with-status';
import { HostingRequestService } from 'src/app/services/hosting-request/hosting-request.service';

@Component({
  selector: 'pzd-classes-overview',
  templateUrl: './classes-overview.component.html',
  styleUrls: ['./classes-overview.component.sass']
})
export class ClassesOverviewComponent implements OnInit {

  classes: Observable<ClassesWithStatus[][]>;
  legend: string[] = ['Zaakceptowane', 'Oczekujące na akceptacje', 'Odrzucone'];
  courses: LegendDisplay[] = [];
  private status: Map<Status, ClassesStatusEnum>;

  constructor(private hostingRequestService: HostingRequestService) { }

  ngOnInit(): void {
    this.courses = this.initLegend();
    this.status = this.initStatusMap();
    this.hostingRequestService.getRegisteredClasses().subscribe(
      schedule => this.classes = of(
        schedule.map(
          day => day.map(
            element => this.getClassesWithStatus(element)
          )
        )
      )
    );
  }

  public classesPending(legend: LegendDisplay): any {
    return {
      'project-conflict': legend.typ === Typ.PROJECT,
      'exercise-conflict': legend.typ === Typ.EXERCISE,
      'seminar-conflict': legend.typ === Typ.SEMINAR,
      'laboratories-conflict': legend.typ === Typ.LABORATORIES,
      'lecture-conflict': legend.typ === Typ.LECTURE,
      'block': true
    };
  }

  public classesAccepted(legend: LegendDisplay): any {
    return {
      'project': legend.typ === Typ.PROJECT,
      'exercise': legend.typ === Typ.EXERCISE,
      'seminar': legend.typ === Typ.SEMINAR,
      'laboratories': legend.typ === Typ.LABORATORIES,
      'lecture': legend.typ === Typ.LECTURE,
      'block': true
    };
  }

  public classesRejected(): any {
    return {
      'rejected': true,
      'block': true
    };
  }

  private initLegend(): LegendDisplay[] {
    return [
      { typ: Typ.LECTURE, name: 'Wykład' },
      { typ: Typ.EXERCISE, name: 'Ćwiczenia' },
      { typ: Typ.LABORATORIES, name: 'Laboratoria' },
      { typ: Typ.PROJECT, name: 'Projekt' },
      { typ: Typ.SEMINAR, name: 'Seminarium' }
    ];
  }

  private initStatusMap():  Map<Status, ClassesStatusEnum> {
    return new Map<Status, ClassesStatusEnum>([
      [Status.ACCEPTED, ClassesStatusEnum.ACCEPTED],
      [Status.PENDING, ClassesStatusEnum.PENDING],
      [Status.REJECTED, ClassesStatusEnum.REJECTED]
    ]);
  }

  private getClassesWithStatus(hostingRequest: HostingRequest): ClassesWithStatus {
    return { classes: hostingRequest.class, status: this.status.get(hostingRequest.status)! }
  }
}

interface LegendDisplay {
  typ: Typ,
  name: string
}
