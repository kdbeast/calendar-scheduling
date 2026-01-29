import { IsEnum, IsNotEmpty } from "class-validator";
import { IntegrationAppTypeEnum } from "../entities/integretion";

export class AppTypeDTO {
  @IsEnum(IntegrationAppTypeEnum)
  @IsNotEmpty()
  appType: IntegrationAppTypeEnum;
}
