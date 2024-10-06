import { pgTable,serial,text,varchar } from "drizzle-orm/pg-core";

export const MockInterview=pgTable('mockInterview',{
  id:serial('id').primaryKey(),
  jsonMockResp:text('jsonMockResp').notNull(),
  jobPosition:varchar('jobPosition').notNull(),
  jobDesc:varchar('jobDesc').notNull(),
  jobExperience:varchar('jobExperience').notNull(),
  createdBy:varchar('createdBy').notNull(),
  createdAt:varchar('createdAt').notNull(),
  mockID:varchar('mockID').notNull()
})

 export const UserAnswer=pgTable('UserAnswer',{
  id:serial('id').primaryKey(),
  mockIDRef:varchar('mockID').notNull(),
  question:varchar('question').notNull(),
  correctAns:varchar('correctAns'),
  userAns:text('userAns'),
  feedback:text('feedback'),
  rating:varchar('rating'),
  userEmail:varchar('userEmail'),
  createdAt:varchar('createdAt'),

 })