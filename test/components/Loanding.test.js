import React from "react";
import { createShallow } from '@material-ui/core/test-utils';
import Adapter from 'enzyme-adapter-react-16';
import Loanding from '../../src/components/Loanding';
import { shallow, configure } from 'enzyme';

configure({adapter: new Adapter()});

describe('<Loanding />', () => {
  let shallow;

  beforeAll (() => {
    shallow = createShallow(); 
  });

  it('should work', () => {
    const wrapper = shallow(<Loanding />);
  });
});