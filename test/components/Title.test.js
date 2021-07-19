import React from "react";
import { createShallow } from '@material-ui/core/test-utils';
import Adapter from 'enzyme-adapter-react-16';
import Title from '../../src/components/Title';
import { shallow, configure } from 'enzyme';

configure({adapter: new Adapter()});

describe('<Title />', () => {
  let shallow;

  beforeAll (() => {
    shallow = createShallow(); 
  });

  it('should work', () => {
    const wrapper = shallow(<Title />);
  });
});