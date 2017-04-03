import React from 'react';

import config from '../../../config';

const showDevTools = process.env.BUILD_FLAG_IS_DEV;
const showGridOverlay = config('showGridOverlay');
const gridIsEnabled = showGridOverlay === 'true' ||
                      showGridOverlay === 'horizontal' ||
                      showGridOverlay === 'vertical';

const showMobx = showDevTools;
const showGrid = gridIsEnabled || showDevTools;

const MobxDevTools = showMobx && require('mobx-react-devtools').default;
const GridOverlay = showGrid && require('components/grid-overlay').default;

// eslint-disable-next-line
const DevTools = showDevTools || showGrid ? () => (
  <div>
    <GridOverlay
      columns={12}
      baseline={16}
      horizontalDisabled={showGridOverlay === 'vertical'}
      verticalDisabled={showGridOverlay === 'horizontal'}
    />
  </div>
) : (() => null);

export default DevTools;

/*
const DevTools = showDevTools ? () => (
  <div>
    <MobxDevTools />
    <GridOverlay columns={12} baseline={16} />
  </div>
) : (() => null);
*/