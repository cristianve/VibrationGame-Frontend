import React from "react";
import { createShallow } from '@material-ui/core/test-utils';
import Adapter from 'enzyme-adapter-react-16';
import Footer from '../../src/components/Footer.js';
import { shallow, configure } from 'enzyme';

configure({adapter: new Adapter()});

describe('<Footer />', () => {
  let shallow;

  beforeAll (() => {
    shallow = createShallow(); 
  });

  it('should work', () => {
    const wrapper = shallow(<Footer />);
  });
});