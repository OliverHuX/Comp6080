import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import Chart from './Chart';
import Title from './Title';

describe('ResultTable Component', () => {
  const data = [100, 30, 90, 80, 20, 100, 60];
  const title = 'sample title';
  it('uses the given title', () => {
    const chart = shallow(<Chart title={title} />);
    chart.contains(<Title>{title}</Title>);
  });
  it('has the given data in the chart', () => {
    const chart = shallow(<Chart data={data} title={title}/>);
    const newData = chart.childAt(1).childAt(0).props().data;
    expect(newData).toStrictEqual([
      { question: 'Q0', amount: 100 },
      { question: 'Q1', amount: 30 },
      { question: 'Q2', amount: 90 },
      { question: 'Q3', amount: 80 },
      { question: 'Q4', amount: 20 },
      { question: 'Q5', amount: 100 },
      { question: 'Q6', amount: 60 }
    ])
  });
  it('has data key question at x axis', () => {
    const chart = shallow(<Chart data={data} title={title}/>);
    const xAxis = chart.childAt(1).childAt(0).props().children[0];
    expect(xAxis.type.displayName).toBe('XAxis');
    expect(xAxis.props.dataKey).toBe('question');
  });
  it('has data key question at y axis', () => {
    const chart = shallow(<Chart data={data} title={title}/>);
    const yAxis = chart.childAt(1).childAt(0).props().children[2];
    expect(yAxis.type.displayName).toBe('Line');
    expect(yAxis.props.dataKey).toBe('amount');
  });
  it('renders with minimal props (snapshot)', () => {
    const chart = renderer.create(<Chart/>).toJSON();
    expect(chart).toMatchSnapshot();
  });
  it('renders with title props (snapshot)', () => {
    const chart = renderer.create(<Chart title={title} />).toJSON();
    expect(chart).toMatchSnapshot();
  });
  it('renders with title and data props (snapshot)', () => {
    const chart = renderer.create(<Chart title={title} data={data} />).toJSON();
    expect(chart).toMatchSnapshot();
  });
})
