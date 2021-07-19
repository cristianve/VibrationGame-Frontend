import React from "react";
import { createShallow } from '@material-ui/core/test-utils';
import Adapter from 'enzyme-adapter-react-16';
import RightPattern from '../../../../src/components/slides/Figures/RightPattern.js';
import { shallow, configure } from 'enzyme';

configure({adapter: new Adapter()});

describe('<CirclePattern />', () => {
  let shallow;

  beforeAll (() => {
    shallow = createShallow(); 
  });

  it('should work', () => {
    const wrapper = shallow(<RightPattern />);
  });
});