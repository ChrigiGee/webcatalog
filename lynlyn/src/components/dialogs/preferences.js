import React from 'react';
import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import BuildIcon from '@material-ui/icons/Build';
import Button from '@material-ui/core/Button';
import CodeIcon from '@material-ui/icons/Code';
import ColorLensIcon from '@material-ui/icons/ColorLens';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import HistoryIcon from '@material-ui/icons/History';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import MouseIcon from '@material-ui/icons/Mouse';
import Paper from '@material-ui/core/Paper';
import SecurityIcon from '@material-ui/icons/Security';
import Slide from '@material-ui/core/Slide';
import Switch from '@material-ui/core/Switch';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import teal from '@material-ui/core/colors/teal';

import connectComponent from '../../helpers/connect-component';

import { close } from '../../state/dialogs/preferences/actions';
import { open as openDialogClearBrowsingData } from '../../state/dialogs/clear-browsing-data/actions';
import { open as openDialogInjectCSS } from '../../state/dialogs/inject-css/actions';
import { open as openDialogInjectJS } from '../../state/dialogs/inject-js/actions';
import { open as openDialogLockApp } from '../../state/dialogs/lock-app/actions';
import { open as openDialogProxyRules } from '../../state/dialogs/proxy-rules/actions';
import { open as openDialogRelaunch } from '../../state/dialogs/relaunch/actions';
import { open as openDialogReset } from '../../state/dialogs/reset/actions';
import { open as openDialogUserAgent } from '../../state/dialogs/user-agent/actions';
import { requestSetPreference } from '../../senders/preferences';

import {
  STRING_ADVANCED,
  STRING_APPERANCE,
  STRING_BLOCK_POPUP,
  STRING_CHANGE,
  STRING_CLEAR_BROWSING_DATA,
  STRING_CLEAR_BROWSING_DATA_DESC,
  STRING_CLOSE,
  STRING_CONTINUE,
  STRING_DARK_THEME,
  STRING_DARK_THEME_DESC,
  STRING_DEFAULT,
  STRING_DEVELOPERS,
  STRING_GENERAL,
  STRING_INJECT_CSS,
  STRING_INJECT_JS,
  STRING_KEEP_LOCAL_DATA_ONLY_UNTIL_YOU_QUIT_YOUR_BROWSER,
  STRING_NONE,
  STRING_PREFERENCES,
  STRING_PRIVACY_AND_SECURITY,
  STRING_PROXIES,
  STRING_RESET,
  STRING_RESET_DESC,
  STRING_SHOW_NAVIGATION_BAR,
  STRING_SWIPE_TO_NAVIGATE,
  STRING_SWIPE_TO_NAVIGATE_DESC,
  STRING_SYSTEM,
  STRING_TRACKPAD,
  STRING_USER_AGENT,
  STRING_USE_HARDWARE_ACCELERATION,
  STRING_LOCK_APP,
  STRING_PASSWORD,
} from '../../constants/strings';

import FakeTitleBar from '../shared/fake-title-bar';

const styles = theme => ({
  dialogContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
  },
  dialogContentRight: {
    flex: 1,
    padding: 24,
    background: theme.palette.background.default,
    overflow: 'auto',
  },
  paperTitleContainer: {
    border: 'none',
    outline: 'none',
    '&:not(:first-child)': {
      marginTop: 36,
    },
  },
  paperTitle: {
    width: '100%',
    maxWidth: 720,
    margin: '0 auto',
    fontWeight: 600,
    color: theme.palette.text.primary,
    marginBottom: 4,
    paddingLeft: 16,
    fontSize: 13,
  },
  paper: {
    maxWidth: 720,
    margin: '0 auto',
  },
  appBar: {
    position: 'relative',
    zIndex: 1,
  },
  listContainer: {
    flex: '0 0 252px',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  flex: {
    flex: 1,
  },
  link: {
    color: teal[500],
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

const getSecondaryText = (text) => {
  if (text && text.length > 40) {
    return `${text.substring(0, 40).trim()}...`;
  }

  return text;
};

const Transition = props => <Slide direction="up" {...props} />;

class PreferencesDialog extends React.Component {
  constructor(props) {
    super(props);
    this.scrollIntoView = this.scrollIntoView.bind(this);
  }

  scrollIntoView(refName) {
    // Explicitly scrollIntoView the text input using the raw DOM API
    const divFirst = this[refName];
    divFirst.scrollIntoView();
  }

  render() {
    const {
      blockPopup,
      classes,
      darkTheme,
      injectCSS,
      injectJS,
      notPersistCookies,
      onClose,
      onOpenDialogClearBrowsingData,
      onOpenDialogInjectCSS,
      onOpenDialogInjectJS,
      onOpenDialogLockApp,
      onOpenDialogProxyRules,
      onOpenDialogRelaunch,
      onOpenDialogReset,
      onOpenDialogUserAgent,
      open,
      proxyRules,
      showNavigationBar,
      swipeToNavigate,
      useHardwareAcceleration,
      userAgent,
    } = this.props;

    const { scrollIntoView } = this;

    return (
      <Dialog
        fullScreen
        onClose={onClose}
        open={open}
        TransitionComponent={Transition}
      >
        <FakeTitleBar />
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="title" color="inherit" className={classes.flex}>
              {STRING_PREFERENCES}
            </Typography>
            <Button color="inherit" onClick={onClose}>
              {STRING_CLOSE}
            </Button>
          </Toolbar>
        </AppBar>
        <div className={classes.dialogContent}>
          <div className={classes.listContainer}>
            <List subheader={<ListSubheader>{STRING_GENERAL}</ListSubheader>} dense>
              <ListItem
                button
              >
                <ListItemIcon>
                  <ColorLensIcon />
                </ListItemIcon>
                <ListItemText
                  primary={STRING_APPERANCE}
                  onClick={() => scrollIntoView('apperanceTitle')}
                />
              </ListItem>
              {window.platform === 'darwin' && (
                <ListItem
                  button
                >
                  <ListItemIcon>
                    <MouseIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={STRING_TRACKPAD}
                    onClick={() => scrollIntoView('trackpadTitle')}
                  />
                </ListItem>
              )}
            </List>
            <List subheader={<ListSubheader>{STRING_ADVANCED}</ListSubheader>} dense>
              <ListItem
                button
              >
                <ListItemIcon>
                  <SecurityIcon />
                </ListItemIcon>
                <ListItemText
                  primary={STRING_PRIVACY_AND_SECURITY}
                  onClick={() => scrollIntoView('privacyAndSecurityTitle')}
                />
              </ListItem>
              <ListItem
                button
              >
                <ListItemIcon>
                  <BuildIcon />
                </ListItemIcon>
                <ListItemText
                  primary={STRING_SYSTEM}
                  onClick={() => scrollIntoView('systemTitle')}
                />
              </ListItem>
              <ListItem
                button
              >
                <ListItemIcon>
                  <CodeIcon />
                </ListItemIcon>
                <ListItemText
                  primary={STRING_DEVELOPERS}
                  onClick={() => scrollIntoView('developersTitle')}
                />
              </ListItem>
              <ListItem
                button
              >
                <ListItemIcon>
                  <HistoryIcon />
                </ListItemIcon>
                <ListItemText
                  primary={STRING_RESET}
                  onClick={() => scrollIntoView('resetTitle')}
                />
              </ListItem>
            </List>
          </div>
          <div className={classes.dialogContentRight}>
            <div
              className={classes.paperTitleContainer}
              ref={(el) => { this.apperanceTitle = el; }}
            >
              <Typography variant="body2" className={classes.paperTitle}>
                {STRING_APPERANCE}
              </Typography>
            </div>
            <Paper className={classes.paper}>
              <List dense>
                <ListItem
                  button
                  onClick={() => {
                    requestSetPreference('darkTheme', !darkTheme);
                    onOpenDialogRelaunch();
                  }}
                >
                  <ListItemText
                    primary={STRING_DARK_THEME}
                    secondary={STRING_DARK_THEME_DESC}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={darkTheme}
                      onChange={(e, checked) => {
                        requestSetPreference('darkTheme', checked);
                        onOpenDialogRelaunch();
                      }}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem
                  button
                  onClick={() => {
                    requestSetPreference('showNavigationBar', !showNavigationBar);
                  }}
                >
                  <ListItemText
                    primary={STRING_SHOW_NAVIGATION_BAR}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={showNavigationBar}
                      onChange={(e, checked) => {
                        requestSetPreference('showNavigationBar', checked);
                      }}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Paper>
            {window.platform === 'darwin' && (
              <React.Fragment>
                <div
                  className={classes.paperTitleContainer}
                  ref={(el) => { this.trackpadTitle = el; }}
                >
                  <Typography variant="body2" className={classes.paperTitle}>
                    {STRING_TRACKPAD}
                  </Typography>
                </div>
                <Paper className={classes.paper}>
                  <List dense>
                    <ListItem
                      button
                      onClick={() => {
                        requestSetPreference('swipeToNavigate', !swipeToNavigate);
                        onOpenDialogRelaunch();
                      }}
                    >
                      <ListItemText
                        primary={STRING_SWIPE_TO_NAVIGATE}
                        secondary={(
                          <span
                            dangerouslySetInnerHTML={{ __html: STRING_SWIPE_TO_NAVIGATE_DESC }} // eslint-disable-line
                          />
                        )}
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={swipeToNavigate}
                          onChange={(e, checked) => {
                            requestSetPreference('swipeToNavigate', checked);
                            onOpenDialogRelaunch();
                          }}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </Paper>
              </React.Fragment>
            )}

            <div
              className={classes.paperTitleContainer}
              ref={(el) => { this.privacyAndSecurityTitle = el; }}
            >
              <Typography variant="body2" className={classes.paperTitle}>
                {STRING_PRIVACY_AND_SECURITY}
              </Typography>
            </div>
            <Paper className={classes.paper}>
              <List dense>
                <ListItem button onClick={onOpenDialogLockApp}>
                  <ListItemText
                    primary={STRING_PASSWORD}
                    secondary={STRING_LOCK_APP}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      aria-label={STRING_CONTINUE}
                      onClick={onOpenDialogLockApp}
                    >
                      <KeyboardArrowRightIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem
                  button
                  onClick={() => {
                    requestSetPreference('blockPopup', !blockPopup);
                    onOpenDialogRelaunch();
                  }}
                >
                  <ListItemText
                    primary={STRING_BLOCK_POPUP}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={blockPopup}
                      onChange={(e, checked) => {
                        requestSetPreference('blockPopup', checked);
                        onOpenDialogRelaunch();
                      }}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem
                  button
                  onClick={() => {
                    requestSetPreference('notPersistCookies', !notPersistCookies);
                    onOpenDialogRelaunch();
                  }}
                >
                  <ListItemText
                    primary={STRING_KEEP_LOCAL_DATA_ONLY_UNTIL_YOU_QUIT_YOUR_BROWSER}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={notPersistCookies}
                      onChange={(e, checked) => {
                        requestSetPreference('notPersistCookies', checked);
                        onOpenDialogRelaunch();
                      }}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem button onClick={onOpenDialogClearBrowsingData}>
                  <ListItemText
                    primary={STRING_CLEAR_BROWSING_DATA}
                    secondary={STRING_CLEAR_BROWSING_DATA_DESC}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      aria-label={STRING_CONTINUE}
                      onClick={onOpenDialogClearBrowsingData}
                    >
                      <KeyboardArrowRightIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Paper>

            <div
              className={classes.paperTitleContainer}
              ref={(el) => { this.systemTitle = el; }}
            >
              <Typography variant="body2" className={classes.paperTitle}>
                {STRING_SYSTEM}
              </Typography>
            </div>
            <Paper className={classes.paper}>
              <List dense>
                <ListItem
                  button
                  onClick={() => {
                    requestSetPreference('useHardwareAcceleration', !useHardwareAcceleration);
                    onOpenDialogRelaunch();
                  }}
                >
                  <ListItemText
                    primary={STRING_USE_HARDWARE_ACCELERATION}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={useHardwareAcceleration}
                      onChange={(e, checked) => {
                        requestSetPreference('useHardwareAcceleration', checked);
                        onOpenDialogRelaunch();
                      }}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem button onClick={onOpenDialogProxyRules}>
                  <ListItemText
                    primary={STRING_PROXIES}
                    secondary={
                      proxyRules && proxyRules.length > 0 ?
                        proxyRules
                        : STRING_NONE
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      aria-label={STRING_CHANGE}
                      onClick={onOpenDialogProxyRules}
                    >
                      <KeyboardArrowRightIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Paper>

            <div
              className={classes.paperTitleContainer}
              ref={(el) => { this.developersTitle = el; }}
            >
              <Typography
                variant="body2"
                className={classes.paperTitle}
              >
                {STRING_DEVELOPERS}
              </Typography>
            </div>
            <Paper className={classes.paper}>
              <List dense>
                <ListItem button onClick={onOpenDialogUserAgent}>
                  <ListItemText
                    primary={STRING_USER_AGENT}
                    secondary={
                      userAgent && userAgent.length > 0 ?
                        getSecondaryText(userAgent)
                        : STRING_DEFAULT
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton aria-label={STRING_CHANGE} onClick={onOpenDialogUserAgent}>
                      <KeyboardArrowRightIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem button onClick={onOpenDialogInjectCSS}>
                  <ListItemText
                    primary={STRING_INJECT_CSS}
                    secondary={
                      injectCSS && injectCSS.length > 0 ?
                        getSecondaryText(injectCSS)
                        : STRING_NONE
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      aria-label={STRING_CHANGE}
                      onClick={onOpenDialogInjectCSS}
                    >
                      <KeyboardArrowRightIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem button onClick={onOpenDialogInjectJS}>
                  <ListItemText
                    primary={STRING_INJECT_JS}
                    secondary={
                      injectJS && injectJS.length > 0 ?
                        getSecondaryText(injectJS)
                        : STRING_NONE
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton aria-label={STRING_CHANGE} onClick={onOpenDialogInjectJS}>
                      <KeyboardArrowRightIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Paper>

            <div
              className={classes.paperTitleContainer}
              ref={(el) => { this.resetTitle = el; }}
            >
              <Typography variant="body2" className={classes.paperTitle}>
                {STRING_RESET}
              </Typography>
            </div>
            <Paper className={classes.paper}>
              <List dense>
                <ListItem button onClick={onOpenDialogReset}>
                  <ListItemText
                    primary={STRING_RESET}
                    secondary={STRING_RESET_DESC}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      aria-label={STRING_CONTINUE}
                      onClick={onOpenDialogReset}
                    >
                      <KeyboardArrowRightIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Paper>
          </div>
        </div>
      </Dialog>
    );
  }
}

PreferencesDialog.defaultProps = {
  blockPopup: false,
  darkTheme: false,
  injectCSS: '',
  injectJS: '',
  notPersistCookies: false,
  proxyRules: null,
  showNavigationBar: true,
  swipeToNavigate: true,
  useHardwareAcceleration: true,
  userAgent: null,
};

PreferencesDialog.propTypes = {
  blockPopup: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  darkTheme: PropTypes.bool,
  injectCSS: PropTypes.string,
  injectJS: PropTypes.string,
  notPersistCookies: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onOpenDialogClearBrowsingData: PropTypes.func.isRequired,
  onOpenDialogInjectCSS: PropTypes.func.isRequired,
  onOpenDialogInjectJS: PropTypes.func.isRequired,
  onOpenDialogLockApp: PropTypes.func.isRequired,
  onOpenDialogProxyRules: PropTypes.func.isRequired,
  onOpenDialogRelaunch: PropTypes.func.isRequired,
  onOpenDialogReset: PropTypes.func.isRequired,
  onOpenDialogUserAgent: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  proxyRules: PropTypes.string,
  showNavigationBar: PropTypes.bool,
  swipeToNavigate: PropTypes.bool,
  useHardwareAcceleration: PropTypes.bool,
  userAgent: PropTypes.string,
};

const mapStateToProps = (state) => {
  const {
    blockPopup,
    darkTheme,
    injectCSS,
    injectJS,
    notPersistCookies,
    proxyRules,
    showNavigationBar,
    swipeToNavigate,
    useHardwareAcceleration,
    userAgent,
  } = state.preferences;

  return {
    blockPopup,
    darkTheme,
    injectCSS,
    injectJS,
    notPersistCookies,
    open: state.dialogs.preferences.open,
    proxyRules,
    showNavigationBar,
    swipeToNavigate,
    useHardwareAcceleration,
    userAgent,
  };
};

const actionCreators = {
  close,
  openDialogClearBrowsingData,
  openDialogInjectCSS,
  openDialogInjectJS,
  openDialogLockApp,
  openDialogProxyRules,
  openDialogRelaunch,
  openDialogReset,
  openDialogUserAgent,
};

export default connectComponent(
  PreferencesDialog,
  mapStateToProps,
  actionCreators,
  styles,
);