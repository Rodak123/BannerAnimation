import {makeProject} from '@motion-canvas/core';

import intro from './scenes/intro?scene';
import links from './scenes/links?scene';

import './global.css';

export default makeProject({
  scenes: [intro, links],
});
