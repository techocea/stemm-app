"use client";

import { summaryStore } from "@/store/store";
import { QuestionSet } from "@/types";
import React, { useState } from "react";

const QuestionsPage = () => {
  const { questions: questionSet } = summaryStore();

  if (
    !questionSet ||
    !questionSet.questions ||
    questionSet.questions.length === 0
  ) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p className="text-gray-500">
          No questions generated yet. Please return to the upload screen to
          process a PDF.
        </p>
        {/* You might want a button to navigate back here */}
      </div>
    );
  }

  const questionsList = questionSet.questions;

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-3xl">
      {/* Title Section */}
      <header className="mb-8 p-4 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-gray-800">
          {questionSet.title || "AI Generated Questions"}
        </h1>
        <p className="text-gray-500 mt-1">
          Total Questions: {questionsList.length}
        </p>
      </header>

      {/* Questions List */}
      <div className="space-y-4">
        {questionsList.map((questionData, index) => (
          <div
            key={questionData.id}
            className="border-b border-gray-200 bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition duration-150"
          >
            <p className="font-semibold text-gray-800">
              <span className="text-green-600 mr-3">{index + 1}.</span>
              {questionData.question}
            </p>
            {/* Since we don't have answers in your current interface, we display just the question */}
          </div>
        ))}
      </div>

      {/* Optional: Add a button to regenerate or export */}
      {/* <div className="mt-8">
          <Button>Export to Flashcards</Button>
      </div> */}
    </div>
  );
};

export default QuestionsPage;
