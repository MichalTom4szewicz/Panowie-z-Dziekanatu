import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Course } from 'src/app/domain/course';
import { CourseService } from 'src/app/services/course/course.service';
import { CourseUtils } from 'src/app/utils/course-utils';
import { UserUtils } from 'src/app/utils/user-utils';
import { ManageCoursesDialogComponent } from './manage-courses-dialog/manage-courses-dialog.component';

@Component({
  selector: 'pzd-supervisor',
  templateUrl: './supervisor.component.html',
  styleUrls: ['./supervisor.component.sass']
})
export class SupervisorComponent implements OnInit {
  panelOpenState = false;
  coursesList: CourseDisplay[] = [];
  addButton: boolean = true;

  constructor(public dialog: MatDialog, private courseService: CourseService) { }

  ngOnInit(): void {
    this.courseService.getCourses().subscribe(list => this.coursesList = list.map(element => this.getCourseDisplay(element)));
  }

  public displayUser(course: Course): string {
    return UserUtils.displayUser(course.supervisor);
  }

  public mouseover(courseDisplay: CourseDisplay, edit: boolean): void {
    if (edit) {
      courseDisplay.mouseoverEdit = true;
    } else {
      courseDisplay.mouseoverDelete = true;
    }
  }

  public mouseleave(courseDisplay: CourseDisplay, edit: boolean): void {
    if (edit) {
      courseDisplay.mouseoverEdit = false;
    } else {
      courseDisplay.mouseoverDelete = false;
    }
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
      if (update.isSaved) {
        this.courseService.updateCourse(update.course).subscribe(() => {
          element.name = update.course.name;
          element.courseKey = update.course.courseKey;
          element.supervisor = update.course.supervisor;
        });
      }
    });
  }

  public delete(element: Course): void {
    this.courseService.deleteCourse(element).subscribe(() => 
      this.coursesList = this.coursesList.filter(i => i.course.courseKey !== element.courseKey)
    );
  }

  public add(): void {
    this.dialog.open(ManageCoursesDialogComponent, {
      width: '300px',
      data: {
        course: CourseUtils.getEmptyCourse(),
        edit: false
      }
    }).afterClosed().subscribe(save => {
      if (save.isSaved) {
        this.courseService.addCourse(save.course).subscribe(() => {
          this.coursesList = [...this.coursesList, this.getCourseDisplay(save.course)];
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

  private getCourseDisplay(course: Course): CourseDisplay {
    return {
      course: course,
      mouseoverEdit: false,
      mouseoverDelete: false
    }
  }
}

interface CourseDisplay {
  course: Course,
  mouseoverEdit: boolean,
  mouseoverDelete: boolean
}
