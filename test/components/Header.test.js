import React from "react";
import { createShallow } from '@material-ui/core/test-utils';
import Adapter from 'enzyme-adapter-react-16';
import Header from '../../src/components/Header';
import { shallow, configure } from 'enzyme';

configure({adapter: new Adapter()});

describe('<Header />', () => {
  let shallow;

  beforeAll (() => {
    shallow = createShallow(); 
  });

  it('should work', () => {
    const wrapper = shallow(<Header />);
  });
});