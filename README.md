//quiz creation

http://localhost:5000/api/quiz/createquiz


// question creation

http://localhost:5000/api/quiz/createquestion

keep in mind to change the quiz id 


{
  "question": "What is animal?",
  "type": "text",
  "answerText":"cat",
  
  
  "quiz":"68e33c182d4595c182bff017"
}

{
  "question": "What is animal?",
  "type": "single",
  "options": [
    {"text":"tree",
    "isCorrect":false},
    {"text":"man",
    "isCorrect":false},
    {"text":"cat",
    "isCorrect":true}
    ],
  
  "quiz":"68e33c182d4595c182bff017"
}

{
  "question": "What is animal?",
  "type": "multiple",
  "options": [
    {"text":"tree",
    "isCorrect":false},
    {"text":"man",
    "isCorrect":true},
    {"text":"cat",
    "isCorrect":true}
    ],
  
  "quiz":"68e3378dd266ece2bed853fe"
}


// get quiz questions


http://localhost:5000/api/quiz/68e33c182d4595c182bff017/questions

here change the quiz id


// answer Submission


http://localhost:5000/api/quiz/68e33c182d4595c182bff017/submit

here change quiz id in params 

{
  "answers": [
    {
      "questionId": "68e33c322d4595c182bff01a",
      "selectedOptionIds": [
        "68e33c322d4595c182bff01c",
        "68e33c322d4595c182bff01d"
      ]
    },
    {
      "questionId": "68e33c462d4595c182bff020",
      "selectedOptionId": "68e33c462d4595c182bff023"
    },
    {
      "questionId": "68e33c682d4595c182bff027",
      "answer": "cat"
    }
  ]
}


//get all quizes

http://localhost:5000/api/quiz/getallquizes