import React from "react";
import { createShallow } from '@material-ui/core/test-utils';
import Adapter from 'enzyme-adapter-react-16';
import Admin from '../../src/admin/Admin.js';
import { shallow, configure } from 'enzyme';

configure({adapter: new Adapter()});

describe('<Admin />', () => {
  let shallow;

  beforeAll (() => {
    shallow = createShallow(); 
  });

  it('should work', () => {
    const wrapper = shallow(<Admin />);
  });
});