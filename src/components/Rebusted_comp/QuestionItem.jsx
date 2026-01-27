'use client';

import style from "./QuestionItem.module.css";

function QuestionItem({ index, question, answer, onAnswerChange }) {
  return (
    <div className={style.questionBox}>
      <div className={style.questionBoxContent}>
        <h3 className={style.questionText}>
          Question {index + 1}
        </h3>

        <img
          className={style.imageStyle}
          src={question.imageurl}
          alt={`Question ${index + 1}`}
          width="400"
        />

        <br />

        <input
          className={style.inputStyle}
          type="text"
          placeholder="Your guess~"
          value={answer}
          onChange={(e) =>
            onAnswerChange(question.id, e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
        />
      </div>
    </div>
  );
}

export default QuestionItem;
