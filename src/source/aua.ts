import {ArcaeaQuerySource, ArcaeaUserInfo} from "./index";
import {Context, Schema} from "koishi";

export interface ArcaeaUnlimitedApiConfig{
  endpoint:string
  access_token?:string
}

export class ArcaeaUnlimitedApi implements ArcaeaQuerySource{
  static readonly Config : Schema<ArcaeaUnlimitedApiConfig> = Schema.object({
    endpoint:Schema.string().required(),
    access_token:Schema.string()
  })

  constructor(protected ctx:Context,protected config:ArcaeaUnlimitedApiConfig) {
  }

  getRequestPath(path:string):string{
    const isPathEndsWithDirSymbol = path.startsWith('/')
    const isEndpointStartsWithDirSymbol = path.startsWith('/')
    if(isPathEndsWithDirSymbol && isEndpointStartsWithDirSymbol){
      path = path.substring(1)
    }else if(!(isPathEndsWithDirSymbol || isEndpointStartsWithDirSymbol)){
      path = '/' + path
    }
    return this.config.endpoint+path
  }

  async getUserInfo(userId: string|number): Promise<ArcaeaUserInfo> {
    return await this.ctx.http.get(this.getRequestPath('/user/info'),{
      params:{

      },
      headers:{

      }
    })
  }
}
