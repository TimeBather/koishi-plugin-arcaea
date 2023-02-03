import {
  ArcaeaBest30Records,
  ArcaeaInternalError,
  ArcaeaQuerySource,
  ArcaeaResponse,
  ArcaeaResponseStatus,
  ArcaeaUserInfo
} from "./index";
import {Context, Dict, Quester, Schema, Service} from "koishi";

export interface ArcaeaUnlimitedApiConfig{
  type:'aua',
  endpoint:string
  access_token?:string
}

export class ArcaeaUnlimitedApi extends Service implements ArcaeaQuerySource {
  static readonly Config : Schema<ArcaeaUnlimitedApiConfig> = Schema.object({
    type:Schema.const('aua' as const),
    endpoint:Schema.string().required(),
    access_token:Schema.string().role('secret')
  })

  protected client: Quester;

  constructor(protected ctx:Context,protected config:ArcaeaUnlimitedApiConfig) {
    super(ctx,'arcaea')
    this.client = ctx.http.extend({
      endpoint:config.endpoint,
      headers:{
        Authorization:'Bearer ' + config.access_token
      }
    })
  }

  parseError(e):ArcaeaResponse<any>{
    if(e.response){
      try{
        return ArcaeaResponseStatus(e.response.data)
      }catch (e){
        return {
          status:-114514,
          message:"Internal error:"+e.toString()+", arcaea server response:"+JSON.stringify(e.response.body)
        }
      }
    }else{
      return {
        status:-114513,
        message:"Internal error or parser error:"+e.toString()
      }
    }
  }

  async sendRequest(path:string, method:'GET'|'POST'|'PUT'|'DELETE',parameters?:any , body?:any):Promise<ArcaeaResponse<any>>{
    try{
      const response = (await this.client.axios({
        method,
        url:path,
        params:parameters,
        data:body,
        responseType:'json'
      }));
      if(response.data.status<0)return this.parseError({response})
      return ArcaeaResponse(Schema.any())(response.data['content'])
    }catch (e){
      return this.parseError(e)
    }
  }

  async sendUserRequest(path:string,userIdentifier : string|number,parameters : Dict<any>) : Promise<ArcaeaResponse<any>>{
    return await this.sendRequest(path,'GET',{
      ...parameters,
      user:userIdentifier
    })
  }

  async getUserInfo(userIdentifier: string|number,recent?:number): Promise<ArcaeaUserInfo> {
    const response = await this.sendUserRequest('/user/info',userIdentifier,{})
    console.info(response)
    if(response.status<0)throw new ArcaeaInternalError(`${response.message}(${response.status})` ?? "unknown error(-114515)")
    try{
      return ArcaeaUserInfo(response)
    }catch (e){
      throw new ArcaeaInternalError(e.toString())
    }
  }

  async getUserBest30(userIdentifier: string|number): Promise<ArcaeaBest30Records> {
    const response = await this.sendUserRequest('/user/best',userIdentifier,{})
    if(!response.status)throw new ArcaeaInternalError(response.message ?? "unknown error")
    try{
      return ArcaeaBest30Records(response)
    }catch (e){
      throw new ArcaeaInternalError(e.toString())
    }
  }
}
