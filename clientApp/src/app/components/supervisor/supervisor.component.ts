import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Course } from 'src/app/domain/course';
import { CourseService } from 'src/app/services/course/course.service';
import { CourseUtils } from 'src/app/utils/course-utils';
import { ManageCoursesDialogComponent } from './manage-courses-dialog/manage-courses-dialog.component';

@Component({
  selector: 'pzd-supervisor',
  templateUrl: './supervisor.component.html',
  styleUrls: ['./supervisor.component.sass']
})
export class SupervisorComponent implements OnInit {
  panelOpenState = false;
  coursesList: [Course, boolean, boolean][] = [];
  addButton: boolean = true;

  constructor(public dialog: MatDialog, private courseService: CourseService) { }

  ngOnInit(): void {
    this.courseService.getCourses().subscribe(list => this.coursesList = list.map(element => [element, true, true]));
  }

  public mouseover(element: [Course, boolean, boolean], field: number): void {
    element[field] = false;
  }

  public mouseleave(element: [Course, boolean, boolean], field: number): void {
    element[field] = true;
  }

  public edit(element: Course): void {
    let copy: Course = CourseUtils.copyCourse(element);
    this.dialog.open(ManageCoursesDialogComponent, {
      width: '300px',
      data: {
        course: copy,
        edit: true
      }
    }).afterClosed().subscribe(update => {
      if (update[0]) {
        this.courseService.updateCourse(update[1]).subscribe(() => {
          element.name = update[1].name;
          element.courseKey = update[1].courseKey;
          element.supervisor = update[1].supervisor;
        });
      }
    });
  }

  public delete(element: Course): void {
    this.courseService.deleteCourse(element).subscribe(() => 
      this.coursesList = this.coursesList.filter(i => i[0].courseKey !== element.courseKey)
    );
  }

  public add(): void {
    let course: Course = CourseUtils.getEmptyCourse();
    this.dialog.open(ManageCoursesDialogComponent, {
      width: '300px',
      data: {
        course: course,
        edit: false
      }
    }).afterClosed().subscribe(save => {
      if (save[0]) {
        this.courseService.addCourse(save[1]).subscribe(() => {
          this.coursesList = [...this.coursesList, [save[1], true, true]];
        });
      }
    });
  }

  public mouseoverAddButton(): void {
    this.addButton = false;
  }

  public mouseleaveAddButton(): void {
    this.addButton = true;
  }
}
