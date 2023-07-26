import {makeProject} from '@motion-canvas/core';

import audio from '../audio/banner-animation-audio.mp4';

import intro from './scenes/intro?scene';
import links from './scenes/links?scene';

import './global.css';

export default makeProject({
  scenes: [intro, links],
  audio: audio
});
