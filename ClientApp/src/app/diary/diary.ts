export interface DiaryEntry {
  id: number,
  entryDate: string,
  entryText: string,
  color: string,
  total_points:number
}

export interface Top10Months {
  diary_month: string,
  diary_year: string,
  avg_points_completed:number
}

