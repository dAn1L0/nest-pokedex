import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";


export class PaginationDto {
  @IsOptional()
  @Min(1)
  @IsNumber()
  @IsPositive()
  limit?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  offset?: number;
}