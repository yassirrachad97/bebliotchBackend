import { IsNotEmpty, IsString, IsUUID, IsDateString, IsBoolean } from 'class-validator';

export class CreateEmpruntDto {
  @IsNotEmpty()
  @IsUUID() 
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  bookId: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsBoolean()
  returned: boolean;

  @IsNotEmpty()
  @IsDateString()
  endDate: string;
}
