import {ArcaeaUserInfo} from "../source";
import {Fragment, Session} from "koishi";

export function arcaeaTrackStatus(status:number){
  switch (status){
    case 4:
      return 'TRACK COMPLETE'
    default:
      return 'UNKNOWN STATUS'
  }
}

export function arcaeaRecentRender(session:Session,user:ArcaeaUserInfo):Fragment{
  return <>
    <quote id={session.messageId}></quote>
    <p>[Arcaea Recent]</p>
    <p>User Name: {user.account_info.name} (PTT {user.account_info.rating/100})</p>
    <p></p>
    <p>{arcaeaTrackStatus(user.recent_score[0].clear_type)}</p>
    <p>Song: {user.recent_score[0].song_id}</p>
    <p>Score: {user.recent_score[0].score}({user.recent_score[0].difficulty})</p>
    <p>PURE: {user.recent_score[0].perfect_count} + {user.recent_score[0].shiny_perfect_count}</p>
    <p>FAR:  {user.recent_score[0].near_count}</p>
    <p>LOST: {user.recent_score[0].miss_count}</p>
    </>
}
