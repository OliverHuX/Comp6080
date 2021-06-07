import React from 'react';
import { TextButton, TextPopup } from './TextPopup';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

describe('TextButton Component', () => {
  const noop = () => {};
  it('triggers onClick event handler when clicked', () => {
    const onClick = jest.fn();
    shallow(<TextButton handleOnClick={onClick}/>).simulate('click');
    expect(onClick).toHaveBeenCalledTimes(1);
    shallow(<TextButton handleOnClick={onClick}/>).simulate('click');
    shallow(<TextButton handleOnClick={onClick}/>).simulate('click');
    expect(onClick).toHaveBeenCalledTimes(3);
  });
  it('uses given buttonText', () => {
    const buttonText = 'YES';
    const button = shallow(<TextButton handleOnClick={noop} buttonText={buttonText}/>);
    expect(button.text()).toBe(buttonText);
  });
  it('uses fallback buttonText if none provided', () => {
    const button = shallow(<TextButton handleOnClick={noop}/>);
    expect(button.text()).toBe('OK');
  });
  it('renders with minimal props (snapshot)', () => {
    const textButton = renderer.create(<TextButton onClick={noop}/>).toJSON();
    expect(textButton).toMatchSnapshot();
  });
  it('renders with provided button text (snapshot)', () => {
    const textButton = renderer.create(<TextButton onClick={noop} buttonText={'YES'}/>).toJSON();
    expect(textButton).toMatchSnapshot();
  });
});

describe('TextPopup Component', () => {
  const noop = () => {};
  const onClick = jest.fn();
  it('does not display the TextPopup when open is default', () => {
    const textPopup = shallow(<TextPopup setOpen={noop} title={'title'}/>);
    expect(textPopup.props().open).toBe(false);
  });
  it('does not display the TextPopup when prop open is false', () => {
    const textPopup = shallow(<TextPopup open={false} setOpen={noop} title={'title'}/>);
    expect(textPopup.props().open).toBe(false);
  });
  it('opens the TextPopup when prop open is true', () => {
    const textPopup = shallow(<TextPopup open={true} setOpen={noop} title={'title'}/>);
    expect(textPopup.props().open).toBe(true);
  });
  it('uses fallback title if none provided', () => {
    const textPopup = shallow(<TextPopup open={true} setOpen={noop}/>);
    expect(shallow(textPopup.props().children[0]).text()).toBe('Notification');
  });
  it('renders with given title', () => {
    const textPopup = shallow(<TextPopup open={true} setOpen={noop} title={'special title'}/>);
    expect(shallow(textPopup.props().children[0]).text()).toBe('special title');
  });
  it('has two buttons with no buttonText given', () => {
    const textPopup = shallow(<TextPopup open={true} setOpen={noop} title={'title'}/>);
    expect(textPopup.find(TextButton).length).toBe(2);
    const target1 = <TextButton ></TextButton>;
    expect(textPopup.dive().containsMatchingElement(target1)).toBe(true);
    const target2 = <TextButton buttonText={'Cancel'} ></TextButton>;
    expect(textPopup.dive().containsMatchingElement(target2)).toBe(true);
  });
  it('has two buttons when buttonText is given', () => {
    const textPopup = shallow(<TextPopup open={true} setOpen={noop} title={'title'} buttonText={'buttonName'}/>);
    expect(textPopup.find(TextButton).length).toBe(2);
    const target1 = <TextButton buttonText={'buttonName'}></TextButton>;
    expect(textPopup.dive().containsMatchingElement(target1)).toBe(true);
    const target2 = <TextButton buttonText={'Cancel'}></TextButton>;
    expect(textPopup.dive().containsMatchingElement(target2)).toBe(true);
  });
  it('triggers onClick event handler when button clicked ', () => {
    const styledHeader = shallow(<TextPopup open={true} setOpen={noop} title={'title'} buttonText={'buttonName'} handleOnClick={onClick} />);
    const button = styledHeader.find(TextButton).last();
    expect(button.length).toBe(1);
    button.props().handleOnClick();
    expect(onClick).toHaveBeenCalledTimes(1);
  })
  it('renders with minimal props (snapshot)', () => {
    const textPopup = renderer.create(<TextPopup setOpen={noop}/>).toJSON();
    expect(textPopup).toMatchSnapshot();
  });
  it('renders with provided title (snapshot)', () => {
    const textPopup = renderer.create(<TextPopup setOpen={noop} title={'special title'}/>).toJSON();
    expect(textPopup).toMatchSnapshot();
  });
  it('renders with provided title and buttonText (snapshot)', () => {
    const textPopup = renderer.create(<TextPopup setOpen={noop} title={'special title'} buttonText={'buttonName'}/>).toJSON();
    expect(textPopup).toMatchSnapshot();
  });
  it('renders with provided title, buttonText and onclick function (snapshot)', () => {
    const textPopup = renderer.create(<TextPopup setOpen={noop} title={'special title'} buttonText={'buttonName'} handleOnClick={onClick}/>).toJSON();
    expect(textPopup).toMatchSnapshot();
  });
});
