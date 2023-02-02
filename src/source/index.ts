export interface ArcaeaQuerySource{
  getUserInfo(user:number|string):Promise<ArcaeaUserInfo>
}

export interface ArcaeaUserInfo{
  user_id?:number
  name:string
  rating:number
  recent_score?:ArcaeaPlayRecord[]
  character?:number
  join_date?:Date
  is_skill_sealed?:boolean
  is_char_uncapped?:boolean
  is_char_uncapped_override?:boolean
  is_mutual?:boolean
}

export interface ArcaeaPlayRecord{
  song_id:string
  difficulty:string
  score:number
  shiny_perfect_count:number
  perfect_count:number
  near_count:number
  miss_count:number
  clear_type?:number
  best_clear_type?:number
  health?:number
  time_played:Date
  modifier:number
  rating:number
}

export interface ArcaeaBest30Records{
  best30_avg:number
  recent10_avg:number
  best30_list:ArcaeaPlayRecord[]
}
