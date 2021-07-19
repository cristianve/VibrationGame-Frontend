import React from "react";
import { createShallow } from '@material-ui/core/test-utils';
import Adapter from 'enzyme-adapter-react-16';
import ShakePattern from '../../../../src/components/slides/Figures/ShakePattern';
import { shallow, configure } from 'enzyme';

configure({adapter: new Adapter()});

describe('<ShakePattern />', () => {
  let shallow;

  beforeAll (() => {
    shallow = createShallow(); 
  });

  it('should work', () => {
    const wrapper = shallow(<ShakePattern />);
  });
});