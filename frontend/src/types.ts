export interface Course {
  id: string;
  name: string;
  credit: number;
  preCourse: string[];
  isCore: boolean;
  isBasic: boolean;
}

export interface ScheduleResponse {
  max_credit: number;
  schedule: Course[][];
}
