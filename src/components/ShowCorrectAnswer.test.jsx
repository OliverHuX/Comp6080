import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import ShowCorrectAnswer from './ShowCorrectAnswer';

describe('Title Component', () => {
  const data = [
    { answer1: true },
    { answer2: false },
    { answer3: false },
    { answer4: true },
    { answer5: false },
    { answer6: true },
  ]
  it('has default title', () => {
    const answer = shallow(<ShowCorrectAnswer answer={[]} ></ShowCorrectAnswer>);
    const title = answer.props().children[0].props;
    expect(title.children[0]).toBe('Answer:');
    expect(title.component).toBe('h1');
    expect(title.variant).toBe('h5');
    expect(title.align).toBe('center');
    expect(title.color).toBe('primary');
  });
  it('renders with one data', () => {
    const answer = shallow(<ShowCorrectAnswer answer={data.slice(0, 2)} answerIds={[0]} ></ShowCorrectAnswer>);
    expect(answer.props().children[1].length).toBe(1);
    const content1 = answer.props().children[1][0].props.children[0];
    expect(content1).toBe('answer1');
  });
  it('renders with multiple data', () => {
    const answer = shallow(<ShowCorrectAnswer answer={data} answerIds={[0, 3, 5]} ></ShowCorrectAnswer>);
    expect(answer.props().children[1].length).toBe(3);
    const content1 = answer.props().children[1][0].props.children[0];
    expect(content1).toBe('answer1');
    const content2 = answer.props().children[1][1].props.children[0];
    expect(content2).toBe('answer4');
    const content3 = answer.props().children[1][2].props.children[0];
    expect(content3).toBe('answer6');
  });
  it('renders with minimal props (snapshot)', () => {
    const answer = renderer.create(<ShowCorrectAnswer answer={[]} ></ShowCorrectAnswer>).toJSON();
    expect(answer).toMatchSnapshot();
  });
  it('renders with one data (snapshot)', () => {
    const answer = renderer.create(<ShowCorrectAnswer answer={data.slice(0, 2)} answerIds={[0]} ></ShowCorrectAnswer>).toJSON();
    expect(answer).toMatchSnapshot();
  });
  it('renders with multiple data (snapshot)', () => {
    const answer = renderer.create(<ShowCorrectAnswer answer={data} answerIds={[0, 3, 5]} ></ShowCorrectAnswer>).toJSON();
    expect(answer).toMatchSnapshot();
  });
})
