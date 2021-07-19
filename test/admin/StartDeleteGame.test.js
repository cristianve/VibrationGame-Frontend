import React from "react";
import { createShallow } from '@material-ui/core/test-utils';
import Adapter from 'enzyme-adapter-react-16';
import StartDeleteGame from '../../src/admin/StartDeleteGame';
import { shallow, configure } from 'enzyme';

configure({adapter: new Adapter()});

describe('<StartDeleteGame />', () => {
  let shallow;

  beforeAll (() => {
    shallow = createShallow(); 
  });

  it('should work', () => {
    const wrapper = shallow(<StartDeleteGame />);
  });
});