import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import Title from './Title';

describe('Title Component', () => {
  it('has props children', () => {
    const title = shallow(<Title>title string</Title>);
    title.contains('title string').valueOf(true);
  });
  it('has no rops children', () => {
    const title = shallow(<Title></Title>);
    title.contains('title string').valueOf(false);
  });
  it('renders with minimal props (snapshot)', () => {
    const title = renderer.create(<Title></Title>).toJSON();
    expect(title).toMatchSnapshot();
  });
  it('renders with props (snapshot)', () => {
    const title = renderer.create(<Title>Sample title</Title>).toJSON();
    expect(title).toMatchSnapshot();
  });
})
