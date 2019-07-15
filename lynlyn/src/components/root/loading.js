import React from 'react';
import PropTypes from 'prop-types';

import CircularProgress from '@material-ui/core/CircularProgress';

import connectComponent from '../../helpers/connect-component';

const styles = {
  root: {
    alignItems: 'center',
    bottom: 0,
    height: 36,
    justifyContent: 'center',
    position: 'fixed',
    width: 36,
    zIndex: 100,
    right: 6,
  },
};

const Loading = (props) => {
  const {
    classes,
  } = props;

  return (
    <div className={classes.root}>
      <CircularProgress size={24} />
    </div>
  );
};

Loading.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connectComponent(
  Loading,
  null,
  null,
  styles,
);
