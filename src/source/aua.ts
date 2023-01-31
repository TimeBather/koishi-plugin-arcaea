import {ArcaeaQuerySource} from "./index";
import {Context, Schema} from "koishi";

export interface ArcaeaUnlimitedApiConfig{

}

export class ArcaeaUnlimitedApi implements ArcaeaQuerySource{
  static readonly Config : Schema<ArcaeaUnlimitedApiConfig> = Schema.object({

  })

  constructor(protected ctx:Context,protected config:ArcaeaUnlimitedApiConfig) {
  }
}
