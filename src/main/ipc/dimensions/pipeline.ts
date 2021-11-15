/**
 * Pipelined set of functionalities that combine several functions together
 */

import { Dimension } from 'dimensions-ai-temp/lib/main/Dimension';
import DimensionsApi from './dimensions';
import { handleFunc } from '../wrapper';

export const setup = (dim: Dimension, store: Store) => {
  /**
   * Auxillary
   */
  handleFunc(DimensionsApi, 'runSingleEpisode', {
    dim,
    store,
  });
};
