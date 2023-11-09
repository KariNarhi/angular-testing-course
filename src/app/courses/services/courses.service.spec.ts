import { COURSES, findLessonsForCourse } from "./../../../../server/db-data";
import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { CoursesService } from "./courses.service";
import { Course } from "../model/course";
import { HttpErrorResponse, HttpRequest } from "@angular/common/http";

describe("CoursesService", () => {
  let coursesService: CoursesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CoursesService],
    });

    coursesService = TestBed.inject(CoursesService);

    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it("should retrieve all courses", () => {
    coursesService.findAllCourses().subscribe((courses) => {
      expect(courses).toBeTruthy("No courses returned");

      expect(courses.length).toBe(12, "incorrect number of courses");

      const course = courses.find((course) => course.id == 12);

      expect(course.titles.description).toBe("Angular Testing Course");
    });

    const testRequest = httpTestingController.expectOne("/api/courses");

    const httpRequest = testRequest.request as HttpRequest<null>;

    expect(httpRequest.method).toEqual("GET");

    testRequest.flush({
      payload: Object.values(COURSES),
    });
  });

  it("should find a course by id", () => {
    coursesService.findCourseById(12).subscribe((course) => {
      expect(course).toBeTruthy();
      expect(course.id).toBe(12);
    });

    const testRequest = httpTestingController.expectOne("/api/courses/12");

    const httpRequest = testRequest.request as HttpRequest<null>;

    expect(httpRequest.method).toEqual("GET");

    testRequest.flush(COURSES[12]);
  });

  it("should save the course data", () => {
    const changes: Partial<Course> = {
      titles: { description: "Testing Course" },
    };

    coursesService.saveCourse(12, changes).subscribe((course) => {
      expect(course.id).toBe(12);
    });

    const testRequest = httpTestingController.expectOne("/api/courses/12");

    const httpRequest = testRequest.request as HttpRequest<Partial<Course>>;

    expect(httpRequest.method).toEqual("PUT");

    expect(httpRequest.body.titles.description).toEqual(
      changes.titles.description
    );

    testRequest.flush({
      ...COURSES[12],
      ...changes,
    });
  });

  it("should give an error if save course fails", () => {
    const changes: Partial<Course> = {
      titles: { description: "Testing Course" },
    };

    coursesService.saveCourse(12, changes).subscribe(
      () => fail("the save course should have failed"),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
      }
    );

    const testRequest = httpTestingController.expectOne("/api/courses/12");

    const httpRequest = testRequest.request as HttpRequest<Partial<Course>>;

    expect(httpRequest.method).toEqual("PUT");

    testRequest.flush("Save course failed", {
      status: 500,
      statusText: "Internal Server Error",
    });
  });

  it("should find a list of lessons", () => {
    coursesService.findLessons(12).subscribe((lessons) => {
      expect(lessons).toBeTruthy();
      expect(lessons.length).toBe(3);
    });

    const testRequest = httpTestingController.expectOne(
      (req: HttpRequest<null>) => req.url == "/api/lessons"
    );

    const httpRequest = testRequest.request as HttpRequest<null>;

    expect(httpRequest.method).toEqual("GET");

    expect(httpRequest.params.get("courseId")).toEqual("12");

    expect(httpRequest.params.get("filter")).toEqual("");

    expect(httpRequest.params.get("sortOrder")).toEqual("asc");

    expect(httpRequest.params.get("pageNumber")).toEqual("0");

    expect(httpRequest.params.get("pageSize")).toEqual("3");

    testRequest.flush({
      payload: findLessonsForCourse(12).slice(0, 3),
    });
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
