import { ApiProperty } from "@nestjs/swagger";
import { IsPositive, Min } from "class-validator";
import { CreateEvaluationAssignmentDto } from './create-evaluation-assignment.dto';

export class CreateQuizEvaluationDto extends CreateEvaluationAssignmentDto {
    @ApiProperty({ description: 'The assignment ID' })
    @IsPositive()
    @Min(1)
    readonly assignmentId: number;
    
    @ApiProperty({ description: 'The trainee ID' })
    @IsPositive()
    @Min(1)
    readonly traineeId: number;
}