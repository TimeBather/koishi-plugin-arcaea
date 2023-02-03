import { Context, Schema } from 'koishi'
import {ArcaeaUnlimitedApi, ArcaeaUnlimitedApiConfig} from "./source/aua";
import {ArcaeaInternalError} from "./source";
import {arcaeaRecentRender} from "./render/text";

export const name = 'arcaea'

export interface Config {
  api:{type:string} | ArcaeaUnlimitedApiConfig | {type:'estertion'}
}

declare module "koishi"{
  interface Context{
    arcaea:ArcaeaUnlimitedApi
  }
}

export const Config: Schema<Config> = Schema.object({
  api:Schema.intersect([
    Schema.object({
      type:Schema.union([
        Schema.const('aua').description("Arcaea Unlimited API(BotArcAPI)").required(),
        Schema.const('estertion')]).description('Estertion Arcaea API(施工中)').required()
    }),
    Schema.union([
      ArcaeaUnlimitedApi.Config,
      Schema.object({type:Schema.const('estertion')})
    ] as const)
  ] as const)
})

export function apply(ctx: Context,config:Config) {
  if(!config.api)return;
  switch (config.api.type){
    case 'aua':
      ctx.plugin(ArcaeaUnlimitedApi,config.api as any)
      break;
  }
  ctx.using(['arcaea'],(ctx)=>{
    console.info("Arcaea Loaded")
    ctx.command('arcaea.recent [user]','Arcaea用户信息查询')
      .action(async ({session},user)=>{
        try{
          const response = await ctx.arcaea.getUserInfo(user)
          return arcaeaRecentRender(session,response)
        }catch (e){
          if(e instanceof ArcaeaInternalError){
            return e.toString()
          }
        }
      })
  })
}

export {ArcaeaUnlimitedApi}
