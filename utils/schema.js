import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

export const MockInterview = pgTable('mockInterview', {
    id: serial('id').primaryKey(),
    jsonMockResp: text('jsonMockResp').notNull(),
    jobPosition: varchar('jobPosition').notNull(),
    jobDescription: varchar('jobDescription').notNull(), // Fixed typo from 'jobDescriptiom'
    jobExpirence: varchar('jobExperience').notNull(), // Fixed typo from 'jobExpirence'
    createdBy: varchar('createdBy').notNull(), // Fixed typo from 'creadteBy'
    createdAt: varchar('createdAt').notNull(), // Fixed typo from 'creadteAt'
    mockId: varchar('mockId').notNull(),
});

export const userAnswer = pgTable('userAnswer', {
    id: serial('id').primaryKey(),
    mockIdRef: varchar('mockId').notNull(),
    question: varchar('question').notNull(),
    correctAnswer: text('correctAnswer'),
    userAnswer: text('userAnswer'),
    feedback: text('feedback'),
    rating: varchar('rating'),
    userEmail: varchar('userEmail'),
    createdAt: varchar('createdAt'),
});
