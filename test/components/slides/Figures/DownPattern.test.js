import React from "react";
import { createShallow } from '@material-ui/core/test-utils';
import Adapter from 'enzyme-adapter-react-16';
import DownPattern from '../../../../src/components/slides/Figures/DownPattern';
import { shallow, configure } from 'enzyme';

configure({adapter: new Adapter()});

describe('<DownPattern />', () => {
  let shallow;

  beforeAll (() => {
    shallow = createShallow(); 
  });

  it('should work', () => {
    const wrapper = shallow(<DownPattern />);
  });
});