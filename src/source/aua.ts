import {ArcaeaQuerySource, ArcaeaUserInfo} from "./index";
import {Context, Dict, Quester, Schema} from "koishi";

export interface ArcaeaUnlimitedApiConfig{
  endpoint:string
  access_token?:string
}

export class ArcaeaUnlimitedApi implements ArcaeaQuerySource{
  static readonly Config : Schema<ArcaeaUnlimitedApiConfig> = Schema.object({
    endpoint:Schema.string().required(),
    access_token:Schema.string()
  })

  protected client: Quester;

  constructor(protected ctx:Context,protected config:ArcaeaUnlimitedApiConfig) {
    this.client = ctx.http.extend({
      endpoint:config.endpoint,
      headers:{
        Authorization:'Bearer ' + config.access_token
      }
    })
  }

  async sendRequest(path:string, method:'GET'|'POST'|'PUT'|'DELETE', body?:any):Promise<any>{
    this.client.axios({
      method,
      url:path,
      data:body
    })
  }

  async sendUserRequest(path:string,userIdentifier : string|number,parameters : Dict<any>) : Promise<any>{
    return await this.sendRequest(path,'GET',{
      ...parameters,
      user:userIdentifier
    })
  }

  async getUserInfo(userIdentifier: string|number,recent?:number): Promise<ArcaeaUserInfo> {
    return this.sendUserRequest('/user/info',userIdentifier,recent?{recent}:{})
  }
}
