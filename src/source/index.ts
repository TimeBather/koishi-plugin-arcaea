import {Schema} from "koishi";

export interface ArcaeaQuerySource{
  getUserInfo(user:number|string):Promise<ArcaeaUserInfo>
  getUserBest30(user:number|string):Promise<ArcaeaBest30Records>
}

export interface ArcaeaResponseStatus{
  status : number,
  message?: string
}

export const ArcaeaResponseStatus = Schema.object({
  status:Schema.number().required()
})

export interface ArcaeaSuccessfulResponse{
  status : 0
}

export const ArcaeaSuccessfulResponse = Schema.object({
  status:Schema.const(0)
});

export interface ArcaeaPlayRecord{
  song_id:string
  difficulty:number
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

export const ArcaeaPlayRecord = Schema.object({
  song_id:Schema.string().required(),
  difficulty:Schema.number().required(),
  score:Schema.number().required(),
  shiny_perfect_count:Schema.number().required(),
  perfect_count:Schema.number().required(),
  near_count:Schema.number().required(),
  miss_count:Schema.number().required(),
  clear_type:Schema.number(),
  best_clear_type:Schema.number(),
  health:Schema.number(),
  time_played:Schema.transform(Schema.number(),t=>new Date(t)).required(),
  modifier:Schema.number().required(),
  rating:Schema.number().required()
})

export interface ArcaeaUserInfo{
  account_info:{
    user_id?:number
    code?:number
    name:string
    character?:number
    join_date?:Date
    is_skill_sealed?:boolean
    is_char_uncapped?:boolean
    is_char_uncapped_override?:boolean
    is_mutual?:boolean
    rating?:number
  }
  recent_score?:ArcaeaPlayRecord[]

}

export const ArcaeaUserInfo:Schema = Schema.object({
  account_info:Schema.object({
    user_id: Schema.number(),
    code: Schema.transform(Schema.string(),t=>parseInt(t)),
    name: Schema.string().required(),
    character: Schema.number(),
    join_date: Schema.transform(Schema.number(),t=>new Date(t)),
    is_skill_sealed: Schema.boolean(),
    is_char_uncapped: Schema.boolean(),
    is_char_uncapped_override: Schema.boolean(),
    is_mutual: Schema.boolean(),
    rating: Schema.number()
  }),
  recent_score: Schema.array(ArcaeaPlayRecord)
})


export interface ArcaeaBest30Records{
  best30_avg:number
  recent10_avg:number
  best30_list:ArcaeaPlayRecord[]
}

export const ArcaeaBest30Records = Schema.object({
  best30_avg:Schema.number().required(),
  recent10_avg:Schema.number().required(),
  best30_list:Schema.array(ArcaeaPlayRecord).required()
})

export type ArcaeaResponse<T> = ArcaeaResponseStatus | (ArcaeaSuccessfulResponse & T)

export const ArcaeaResponse = (T) => Schema.union([
  ArcaeaResponseStatus,
  Schema.intersect([
    ArcaeaSuccessfulResponse,
    T
  ])
])

export class ArcaeaInternalError extends Error{}
