import fetchFunc from '../components/fetchFunc.js';

export default async function handleSubmit (oldQuestions, gameId, questionId, question, questionType, timeLimit, point, file, imageWindow, answers, token, thumbnail) {
  const newQuestions = [...oldQuestions];
  const newQuestion = newQuestions[questionId];
  newQuestion.name = question;
  newQuestion.questionType = questionType;
  newQuestion.timeLimit = timeLimit;
  newQuestion.point = point;
  newQuestion.file = file;
  newQuestion.fileType = imageWindow ? 'image' : 'video';
  newQuestion.answers = answers;
  newQuestions[questionId] = newQuestion;
  const body = {
    questions: newQuestions,
    name: question,
    thumbnail: thumbnail
  };
  await fetchFunc('admin/quiz/' + gameId, 'PUT', token, JSON.stringify(body))
    .then(res => (res.ok ? res : Promise.reject(res)))
    .catch(err => console.warn(err))
}
