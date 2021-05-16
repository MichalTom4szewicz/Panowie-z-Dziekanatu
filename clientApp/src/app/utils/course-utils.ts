import { Course } from "../domain/course";
import { Degree } from "../enums/degree";

export class CourseUtils {
    public static getEmptyCourse(): Course {
        return {
            name: '',
            courseKey: '',
            supervisor: {
                firstName: '',
                lastName: '',
                degree: Degree.NONE,
                username: ''
            }
        }
    }

    public static copyCourse(course: Course): Course {
        return {
            name: course.name,
            courseKey: course.courseKey,
            supervisor: course.supervisor
        }
    }
}
