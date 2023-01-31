import {ArcaeaQuerySource} from "./index";
import {Context, Schema} from "koishi";

export interface ArcaeaEstertionApiConfig{

}

export class ArcaeaUnlimitedApi implements ArcaeaQuerySource{
  static readonly Config : Schema<ArcaeaEstertionApiConfig> = Schema.object({

  })

  constructor(protected ctx:Context,protected config:ArcaeaEstertionApiConfig) {
  }


}
