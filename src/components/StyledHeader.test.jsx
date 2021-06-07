import React from 'react';
import { IconButton, StyledHeader } from './StyledHeader';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import Typography from '@material-ui/core/Typography';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

describe('IconButton Component - An icon with onClick handler', () => {
  const onClick = jest.fn();
  it('has the logout icon by defalt', () => {
    const button = shallow(<IconButton />);
    const target = <ExitToAppIcon></ExitToAppIcon>;
    expect(button.containsMatchingElement(target)).toBe(true);
  })
  it('has the join icon when icon is join', () => {
    const button = shallow(<IconButton icon={'join'} />);
    const target = <SportsEsportsIcon></SportsEsportsIcon>;
    expect(button.containsMatchingElement(target)).toBe(true);
  })
  it('triggers onClick event handler when clicked when icon is logout', () => {
    shallow(<IconButton handleOnClick={onClick}/>).simulate('click');
    expect(onClick).toHaveBeenCalledTimes(1);
  });
  it('triggers onClick event handler when clicked when icon is join', () => {
    shallow(<IconButton handleOnClick={onClick} icon={'join'} />).simulate('click');
    expect(onClick).toHaveBeenCalledTimes(1);
  });
  it('renders with minimal props (snapshot)', () => {
    const button = renderer.create(<IconButton/>).toJSON();
    expect(button).toMatchSnapshot();
  });
  it('renders with icon join props (snapshot)', () => {
    const button = renderer.create(<IconButton icon={'join'}/>).toJSON();
    expect(button).toMatchSnapshot();
  });
  it('renders with provided onClick handler (snapshot)', () => {
    const button = renderer.create(<IconButton handleOnClick={onClick}/>).toJSON();
    expect(button).toMatchSnapshot();
  });
  it('renders with provided onClick handler and icon join(snapshot)', () => {
    const button = renderer.create(<IconButton handleOnClick={onClick} icon={'join'}/>).toJSON();
    expect(button).toMatchSnapshot();
  });
});

describe('StyledHeader Component', () => {
  const onClick = jest.fn();
  it('has the title BigBrain by default', () => {
    const styledHeader = shallow(<StyledHeader />);
    const target = <Typography>BigBrain</Typography>;
    expect(styledHeader.dive().containsMatchingElement(target)).toBe(true);
  })
  it('has join icon by default', () => {
    const styledHeader = shallow(<StyledHeader />);
    expect(styledHeader.find(IconButton).length).toBe(1);
    const target = <IconButton icon={'join'}></IconButton>;
    expect(styledHeader.dive().containsMatchingElement(target)).toBe(true);
  })
  it('does not have the logout icon when not logged in by default', () => {
    const styledHeader = shallow(<StyledHeader />);
    expect(styledHeader.find(IconButton).length).toBe(1);
    const target = <IconButton icon={'logout'}></IconButton>;
    expect(styledHeader.dive().containsMatchingElement(target)).toBe(false);
  })
  it('triggers onClick event handler when join clicked ', () => {
    const styledHeader = shallow(<StyledHeader handleOnClick={onClick} />);
    const button = styledHeader.find(IconButton);
    expect(button.length).toBe(1);
    button.props().handleOnClick();
    expect(onClick).toHaveBeenCalledTimes(1);
  })
  it('has the logout icon when logged in', () => {
    localStorage.setItem('token', 'faskToken');
    const styledHeader = shallow(<StyledHeader />);
    expect(styledHeader.find(IconButton).length).toBe(2);
    const target = <IconButton icon={'logout'}></IconButton>;
    expect(styledHeader.dive().containsMatchingElement(target)).toBe(true);
  })
  it('renders with minimal props which has one logout button(snapshot)', () => {
    const styledHeader = renderer.create(<StyledHeader/>).toJSON();
    expect(styledHeader).toMatchSnapshot();
  });
  it('renders with provided onClick handler (snapshot)', () => {
    const styledHeader = renderer.create(<StyledHeader handleOnClick={onClick}/>).toJSON();
    expect(styledHeader).toMatchSnapshot();
  });
  it('renders with join button and provided onClick handler (snapshot)', () => {
    const styledHeader = renderer.create(<StyledHeader handleOnClick={onClick} icon={'join'} />).toJSON();
    expect(styledHeader).toMatchSnapshot();
  });
});
