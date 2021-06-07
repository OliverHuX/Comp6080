import React from 'react';
import ResultTable from './ResultTable';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import Title from './Title';

describe('ResultTable Component', () => {
  const data = [
    { rank: 1, name: 'Alice', score: 100 },
    { rank: 2, name: 'Ben', score: 90 },
    { rank: 3, name: 'Cathy', score: 80 },
    { rank: 4, name: 'Dan', score: 70 },
    { rank: 5, name: 'Emily', score: 60 },
  ];
  const title = 'Rank Info';
  it('uses fallback title if none provided', () => {
    const resultTable = shallow(<ResultTable data={data} />);
    resultTable.contains(<Title>Table</Title>);
  });
  it('has the given title in the table', () => {
    const resultTable = shallow(<ResultTable data={data} title={title}/>);
    const tableTitle = shallow(resultTable.props().children[0]);
    expect(tableTitle.text()).toBe(title);
    resultTable.contains(<Title>{title}</Title>);
  });
  it('has the given data in the table', () => {
    const resultTable = shallow(<ResultTable data={data} title={title}/>);
    const tableContent = shallow(resultTable.props().children[1]);
    expect(tableContent.text()).toBe('RankNameAnswered Correct1Alice1002Ben903Cathy804Dan705Emily60');
  });
  it('has only table header when no data provided', () => {
    const resultTable = shallow(<ResultTable/>);
    const tableContent = shallow(resultTable.props().children[1]);
    expect(tableContent.text()).toBe('RankNameAnswered Correct');
  });
  it('renders with minimal props (snapshot)', () => {
    const resultTable = renderer.create(<ResultTable/>).toJSON();
    expect(resultTable).toMatchSnapshot();
  });
  it('renders with provided title with no data (snapshot)', () => {
    const resultTable = renderer.create(<ResultTable title={title}/>).toJSON();
    expect(resultTable).toMatchSnapshot();
  });
  it('renders with provided title and data (snapshot)', () => {
    const resultTable = renderer.create(<ResultTable data={data} title={title}/>).toJSON();
    expect(resultTable).toMatchSnapshot();
  });
  it('renders with default title and data (snapshot)', () => {
    const resultTable = renderer.create(<ResultTable data={data} />).toJSON();
    expect(resultTable).toMatchSnapshot();
  });
});
